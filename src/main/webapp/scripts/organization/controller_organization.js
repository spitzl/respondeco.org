'use strict';

respondecoApp.controller('OrganizationController', function($scope, $location, $routeParams, resolvedOrganization,
                                                            Organization, Account, AuthenticationSharedService) {
    var isOwner = false;
    var user;

    $scope.organizations = resolvedOrganization;

    $scope.postingShowCount = 5;
    $scope.postingShowIncrement = 5;
    $scope.postingPage = Organization.getPostingsByOrgId({id:$routeParams.id, pageSize: $scope.postingShowCount})
    $scope.postingInformation = null;

    $scope.update = function(name) {
        $scope.organization = Organization.get({
            id: name
        }, function() {
            Organization.getMembers({
                id: $scope.organization.id
            }, function(data)  {
                $scope.members = data;
            });

            Account.get(null, function(account) {
                user = account;
                isOwner = user !== undefined && user.login === $scope.organization.owner.login;
            });

        });
    };

    $scope.delete = function(id) {
        id = id || $scope.organization.id;

        if (confirm("Wirklich löschen?") === false) return;

        Organization.delete({
                id: id
            },
            function() {
                $scope.organizations = Organization.query();
            });
    };

    $scope.redirectToEdit = function() {
        $location.path('organization/edit/' + $scope.organization.id);
    };

    $scope.isOwner = function() {
        return isOwner;
    };

    $scope.updateUser = function($item, $model, $label) {
        $scope.selectedUser = $item;
    };

    $scope.redirectToOverview = function() {
        $location.path('organization');
    };

    $scope.redirectToOwnResources = function() {
        $location.path('ownresource');
    };

    $scope.redirectToRequests = function() {
        $location.path('requests');
    }

    $scope.redirectToNewProject = function() {
        $location.path('projects/edit/new');
    }

    if ($routeParams.id !== undefined) {
        $scope.update($routeParams.id);
    }


    /**
     * Button Event. Try to follow the current Organization Newsfeed
     */
    $scope.follow = function(){
        Organization.follow({id: $scope.organization.id}, null, function (result) {
            $scope.following = true;
        });
    };

    /**
     * Button Event. Try to un-follow the current Organization Newsfeed
     */
    $scope.unfollow = function(){
        Organization.unfollow({id: $scope.organization.id}, function (result) {
            $scope.following = false;
        });
    };

    /**
     * show or hide the Un-Follow Button. Show only if the current organization is being followed by user
     * @returns {boolean} true => show, else hide
     */
    $scope.showUnfollow = function(){
        return $scope.following == true;// && $scope.isOwner() == false;
    };

    /**
     * show or hide the Follow Button. Show only if the current organization is not being followed by user
     * @returns {boolean} true => show, else hide
     */
    $scope.showFollow = function() {
        return $scope.following == false;// && $scope.isOwner() == false;
    };
    //Posting

    var refreshPostings = function() {
        $scope.postingPage = Organization
            .getPostingsByOrgId({id:$scope.organization.id, pageSize: $scope.postingShowCount})
    };

    $scope.addPosting = function() {
        if($scope.postingInformation.length < 5 || $scope.postingInformation.length > 100) {
            return;
        }
        Organization.addPostingForOrganization({id:$routeParams.id}, $scope.postingInformation,
            function() {
                refreshPostings();
                $scope.postingInformation = null;
                $scope.postingform.$setPristine();
            });
    };

    $scope.deletePosting = function(id) {
        Organization.deletePosting({id:$scope.organization.id,
            pid:id},
            function() {
                refreshPostings();
            });
    };

    $scope.showMorePostings = function() {
        $scope.postingShowCount = $scope.postingShowCount + $scope.postingShowIncrement;
        refreshPostings();
    };

    /**
     * Resolve the follow state for the current organization of logged in user
     */
    $scope.followingState = function(){
        Organization.followingState({id: $routeParams.id}, function(follow){
            $scope.following = follow.state;
        });
    };

    //allow execute follow state only if organization ID is set!
    if($routeParams.id !== 'new' || $routeParams.id !== 'null' || $routeParams.id !== 'undefined') {
        $scope.followingState();
    }
});
