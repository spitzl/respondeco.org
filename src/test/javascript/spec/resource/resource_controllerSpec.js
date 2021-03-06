'use strict';

describe('Resource Controller Tests ', function () {
    beforeEach(module('respondecoApp'));

    describe('ResourceController', function () {
        var $scope, ResourceService, ProjectService, createController, AccountService, OrganizationService, location,
            filter, sce;

        beforeEach(inject(function($rootScope, $controller, $location, $routeParams, Resource, Account, Project, Organization, $filter, $sce) {
            $scope = $rootScope.$new();
            location = $location;
            ResourceService = Resource;
            AccountService = Account;
            ProjectService = Project;
            OrganizationService = Organization;
            filter = $filter;
            sce = $sce;

            $controller('ResourceController', {$scope: $scope, $location: location, $routeParams: $routeParams,
                Resource: ResourceService, Account: AccountService, Organization: OrganizationService,
                Project:ProjectService, $filter: filter, $sce: sce});
        }));

        it('should get Account', function() {
            spyOn(AccountService, "get");
            spyOn(ResourceService, "getByOrgId");

            location.path('ownresource');
            $scope.getAccount();

            expect(AccountService.get).toHaveBeenCalled;
            expect(ResourceService.getByOrgId).toHaveBeenCalled;

            AccountService.get.calls.mostRecent().args[1]({
                organization: {
                    id: 1, name:"test"
                }
            });

            ResourceService.getByOrgId.calls.mostRecent().args[1]("TestData");

            expect($scope.resources).toEqual("TestData");

            expect($scope.organization).toEqual( {
                id:1, name:"test"
            });
        });

         it('should get Account for requests', function() {
            spyOn(AccountService, "get");
            spyOn(ResourceService, "query");

            location.path('requests');
            $scope.getAccount();

            expect(AccountService.get).toHaveBeenCalled;
            expect(ResourceService.getByOrgId).toHaveBeenCalled;

             AccountService.get.calls.mostRecent().args[1]({
                    organization: {
                        id: 1
                    }
            });
        });

        it('should select a project', function() {
            var project = {id: 1};

            spyOn(ProjectService, "getProjectRequirements");

            $scope.selectProject(project);

            expect(ProjectService.getProjectRequirements).toHaveBeenCalledWith({
                id:1}, jasmine.any(Function)
            );

            ProjectService.getProjectRequirements.calls.mostRecent().args[1]();

            expect($scope.showRequirements).toBe(true);
        });

        it('should select a requirement', function() {

            var requirement = {id: 1, organizationId: 1};

            $scope.selectRequirement(requirement, {
                target: ""
            });

            expect($scope.claim.resourceRequirementId).toEqual(1);
            expect($scope.claim.organizationId).toEqual(1);
        });

        it('should claim a resource', function() {
            var res = {id:1};
            $scope.claimResource(res);
            expect($scope.claim.resourceOfferId).toEqual(1);
        });

        it('should clear claimresource', function() {

            $scope.clearClaimResource();

            expect($scope.showRequirements).toBe(false),
            expect($scope.claim).toEqual({organizationId:null,projectId:null, resourceOfferId:null, resourceRequirementId: null});
            expect($scope.resourceRequirements).toEqual([]);
        });

        it('should send claim request', function() {
            $scope.claim = {organizationId:1, projectId:2, resourceOfferId:3, resourceRequirementId:4};
            $scope.claimError = "test";

            spyOn(ResourceService, "claimResource");

            $scope.sendClaimRequest();

            //success callback
            ResourceService.claimResource.calls.mostRecent().args[1]();

            //error callback
            ResourceService.claimResource.calls.mostRecent().args[2]({
               data: {
                    key: "test"
                }
            });

             //expect($scope.claimError).toEqual("test");
        });

        it('should redirect to Project with given id', function() {
            location.path('');
            var id = 1;
            $scope.redirectToProject(id);

            expect(location.path()).toEqual('/projects/1');
        })

        it('should accept the claim/apply', function() {
            spyOn(ResourceService, "updateResource");

            var request = {matchId:1}
            $scope.acceptResource(request);

            expect(ResourceService.updateResource).toHaveBeenCalled();

            ResourceService.updateResource.calls.mostRecent().args[2]();
        });

        it('should decline the request', function() {
            spyOn(ResourceService, "updateResource");

            var request = {matchId:1};
            $scope.declineResource(request);

            expect(ResourceService.updateResource).toHaveBeenCalled();

            ResourceService.updateResource.calls.mostRecent().args[2]();
        });

        it('should create a new resource',function() {
            $scope.resource = {
              "name": "Resource",
              "description": "Desc",
              "id": 1,
              "endDate": "2015-12-12",
              "startDate": "2015-12-12",
              "resourceTags": [
                "Computer", "Test"
              ],
              "amount": 5,
              "isCommercial": false,
              "organizationId": 1
            }

            $scope.isNew = true;

            spyOn(ResourceService, "save");

            $scope.create();

            expect(ResourceService.save).toHaveBeenCalled();

            ResourceService.save.calls.mostRecent().args[1]();
            ResourceService.save.calls.mostRecent().args[2]();

            expect($scope.formSaveError = true);
        });


        it('should show an error message', function() {
            $scope.resource = {
              "name": "Resource",
              "description": "Desc",
              "id": 1,
              "endDate": "2015-12-12",
              "startDate": "2015-12-12",
              "resourceTags": [
                "Computer", "Test"
              ],
              "amount": 5,
              "isCommercial": false,
              "organizationId": 1
            }

            $scope.isNew = false;

            spyOn(ResourceService, "update");

            $scope.create();

            expect(ResourceService.update).toHaveBeenCalledWith($scope.resource, jasmine.any(Function), jasmine.any(Function));

            //Simulate error callback
            ResourceService.update.calls.mostRecent().args[2]({
                data: {
                    error: "Error"
                }
            });

            expect($scope.formSaveError).toBe(true);
        });

        it('should update a resource', function() {
            $scope.resource.resourceTags = ['Technik', 'Computer'];
            spyOn(ResourceService, "get");

            $scope.isNew = false;
            $scope.update('1');

            expect(ResourceService.get).toHaveBeenCalledWith({id:'1'}, jasmine.any(Function), jasmine.any(Function));
        });


        it('should redirect to given id', function() {
            $scope.redirectToResource('1');

            expect(location.path()).toBe('/resource/1');
        });

        it('should clear the resource', function() {
            $scope.resource.id = "1";
            $scope.resource.name = "Resource";
            $scope.resource.amount = 1;
            $scope.resource.dateStart = "11.11.2014";
            $scope.resource.dateEnd = "12.12.2014";
            $scope.resource.isCommercial = true;

            $scope.clear();

            expect($scope.resource).toEqual({'id': null, 'name': null, 'description': null,
                'resourceTags': [], 'amount': null, 'startDate': null, 'endDate': null,
                'isCommercial': false});
        });

        it('should search for resources', function() {
            spyOn(ResourceService,"query");
            $scope.search("filter");
            expect(ResourceService.query).toHaveBeenCalled();

            ResourceService.query.calls.mostRecent().args[1]({
                resourceOffers: []
            });

            ResourceService.query.calls.mostRecent().args[2]();

            expect($scope.searchError).toBe(true);
        });

        it('should delete a resource', function() {
            spyOn(ResourceService, "delete");
            spyOn(ResourceService, "getByOrgId");

            $scope.delete('1');

            expect(ResourceService.delete).toHaveBeenCalledWith({id:'1'}, jasmine.any(Function));

            ResourceService.delete.calls.mostRecent().args[1]();
            expect(ResourceService.getByOrgId).toHaveBeenCalled();
        });

        it('should update the model', function() {
            spyOn(ResourceService, "get");
            $scope.update(1);
            expect(ResourceService.get).toHaveBeenCalledWith({
              id: 1
            }, jasmine.any(Function), jasmine.any(Function));

            ResourceService.get.calls.mostRecent().args[1]({
              resourceTags: []
            });

            ResourceService.get.calls.mostRecent().args[2]();
            expect(location.path()).toEqual("/resource/new");
        });

        it('should update the projects', function() {
            $scope.orgId = 1;

            var response = {projects: [{name:'test'}, {name:'testproject2'}]};

            spyOn(ProjectService,"getProjectsByOrgId").and.returnValue([]);

            $scope.updateProjects();

            expect(ProjectService.getProjectsByOrgId).toHaveBeenCalledWith({organizationId:1}, jasmine.any(Function));

            ProjectService.getProjectsByOrgId.calls.mostRecent().args[1](response);
        });

        it('should load the resource data', function() {
            $scope.orgId = 1;
            spyOn(OrganizationService, "getResourceRequests");

            $scope.loadResourceData();
            expect(OrganizationService.getResourceRequests).toHaveBeenCalledWith({id:1}, jasmine.any(Function));
            OrganizationService.getResourceRequests.calls.mostRecent().args[1]([]);
            expect($scope.applies.length).toBe(0);
            expect($scope.oldResourceMessages.length).toBe(0);
            expect($scope.requests.length).toBe(0);
        });

        it('should redirect to own Organzation',function() {
            location.path('');
            $scope.orgId = 1;
            $scope.redirectToOrganization();
            expect(location.path()).toEqual('/organization/1');
        });

        it('should openStartDate', function() {
            var eventMock = { stopPropagation: function() {}, preventDefault: function() {}, stopImmediatePropagation: function() {} }

            $scope.openStart(eventMock);

            expect($scope.openedStartDate).toBe(true);
        });

        it('should open EndDate', function() {
            var eventMock = { stopPropagation: function() {}, preventDefault: function() {}, stopImmediatePropagation: function() {} }

            $scope.openEnd(eventMock);

            expect($scope.openedEndDate).toBe(true);
        });

        it('should redirect to own resources', function() {
            location.path('');
            $scope.redirectToOwnResources();
            expect(location.path()).toEqual('/ownresource');
        });

        it('should return if a resource is claimable or not', function() {
            $scope.orgId = 1;
            var resource = {name:'test', organization: {id:'1'}};

            var claimable = $scope.isClaimable(resource);

            expect(claimable).toBe(false);

            var resource = {name:'test', organization: {id:'2'}};
            claimable = $scope.isClaimable(resource);

            expect(claimable).toBe(true);
        });

         it('should show an error if startDate is earlier than endDate', function() {
            $scope.resource.startDate = '2014-10-10';
            $scope.resource.endDate = '2014-09-09';

            $scope.create();

            expect($scope.errorEndDateBeforeStartDate).toBe(true);
       });

        it('should set resource logo', function() {
            var fileItem = {};
            var response = {data: 'test', id:1};

            $scope.onUploadComplete(fileItem, response);

            expect($scope.resource.logoId).toEqual(1);
            expect($scope.logo).toEqual({data: 'test', id:1});
        });

        it('should change tab control to switch between apply/request/old data', function(){

            spyOn($scope,"loadResourceData");
            var tab = {url: "test"};
            $scope.onClickTab(tab);
            expect($scope.currentTab).toBe(tab.url);
        });

        it('should set tab control to active or not if we switch between apply/request/old data', function(){

            spyOn($scope,"loadResourceData");
            var tab = {url: "test"};
            $scope.currentTab = tab.url;
            var result = $scope.isActiveTab(tab.url);
            expect(result).toBe(true);
        });

        it('should react to page change', function() {
            spyOn(ResourceService, 'query');
            $scope.currentPage = 2;
            $scope.filter = {
                page: 2,
                pageSize: 20
            };

            $scope.onPageChange();

            expect($scope.filter.page).toEqual(1);
            expect(ResourceService.query).toHaveBeenCalledWith(
                $scope.filter,
                jasmine.any(Function));

            ResourceService.query.calls.mostRecent().args[1]({
                resourceOffers: {
                    id: 1
                },
                totalItems: 2
            });

        });
    });




});
