/**
 * Created by clemens on 01/12/14.
 */

'use strict';

describe('TextMessage Service Tests ', function () {

    beforeEach(module('respondecoApp'));

    describe('Project', function () {
        var serviceTested,
            httpBackend;

        beforeEach(inject(function($httpBackend, Project) {
            serviceTested = Project;
            httpBackend = $httpBackend;
            //Request on app init
            httpBackend.expectGET('i18n/de.json').respond(200, '');
        }));
        //make sure no expectations were missed in your tests.
        //(e.g. expectGET or expectPOST)
        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should call backend with filter parameter when querying for projects by name', function() {
            var returnData = [];
            //expectGET to make sure this is called once.
            httpBackend.expectGET('app/rest/projects?filter=test').respond(returnData);

            //WHEN
            serviceTested.query({filter: "test"});
            //flush the backend to "execute" the request to do the expected POST assertion.
            httpBackend.flush();
        });

        it('should call the backend with tags parameter when querying for projects by tags', function(){
            var returnData =[];
            httpBackend.expectGET('app/rest/projects?tags=test,foo,bar').respond(returnData);

            //WHEN
            serviceTested.query({tags: "test,foo,bar"});
            //flush the backend to "execute" the request to do the expected POST assertion.
            httpBackend.flush();
        });

        it('should call backend with filter and tags parameter when querying for projects by name and tags', function(){
            var returnData = [];
            httpBackend.expectGET('app/rest/projects?filter=test&tags=test,foo,bar').respond(returnData);

            //WHEN
            serviceTested.query({filter: "test", tags: "test,foo,bar"});
            //flush the backend to "execute" the request to do the expected POST assertion.
            httpBackend.flush();
        });

    });
});