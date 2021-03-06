'use strict';

respondecoApp
    .config(function ($routeProvider, $httpProvider, $translateProvider, USER_ROLES) {
        $routeProvider
            .when('/resource', {
                templateUrl: '/views/resources.html',
                controller: 'ResourceController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            }).when('/resource/:id', {
                templateUrl: '/views/resource-new.html',
                controller: 'ResourceController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            }).when('/ownresource', {
                templateUrl: '/views/resources-own.html',
                controller: 'ResourceController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            }).when('/chooseproject', {
                templateUrl: '/views/claimresource.html',
                controller: 'ResourceController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            }).when('/resourcemessages', {
                templateUrl: '/views/resourcemessages.html',
                controller: 'ResourceController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            }).when('/donatedresources', {
                templateUrl: '/views/resources-donated.html',
                controller: 'ResourceController',
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            });
    });
