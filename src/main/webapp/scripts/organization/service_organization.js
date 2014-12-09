'use strict';

respondecoApp.factory('Organization', function ($resource) {
        return $resource('app/rest/organizations/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': { method: 'GET'},
            'update': { method: 'PUT', url: 'app/rest/organizations' },
            'getMembers': { method: 'GET', url: 'app/rest/organizations/:id/members', isArray: true },
            'getOrgJoinRequests': { method: 'GET', url: 'app/rest/organizations/:id/orgjoinrequests', isArray: true },
            'getInvitableUsers': { method: 'GET', url: 'app/rest/organizations/:id/invitableusers', isArray: true },
            'getResourceRequests' : {method: 'GET', url: 'app/rest/organizations/:id/resourcerequests', isArray:true },
            'rateOrganization' : {method: 'POST', url: 'app/rest/organizations/:id/ratings'}
        });
    }).factory('User', function($resource) {
        return $resource('app/rest/users/:id', {}, {
            'get': { method: 'GET'}
        });
    });
