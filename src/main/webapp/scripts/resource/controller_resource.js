'use strict';

respondecoApp.controller('ResourceController', function($scope, $location, $routeParams, Resource, Account, Organization) {

	$scope.resource = {resourceTags: [], isCommercial: false, isRecurrent: false};
	$scope.organization = null;

	var id = $routeParams.id;
	$scope.isNew = id === 'new';

	$scope.resources = Resource.query();

	Account.get(null, function(account) {
		console.log(account);
		$scope.resource.organizationId = account.organizationId;

		$scope.organization = Organization.get({id: account.organizationId}, function(organization) {
			$scope.organization = organization;
		});
	});

	$scope.redirectToResource = function(id) {
		$location.path('resource/' + id);
	}

	$scope.search = function(filter) {
		Resource.query({filter: filter}, 
			function(res) {
				$scope.resources = res;
			});
	}

	$scope.update = function(id) {
		Resource.get({id: id}, function(resource) {
			$scope.resource = resource;
		}, function() {
			$scope.redirectToResource('new');
		});
	}

	$scope.create = function() {
		Resource[$scope.isNew ? 'save' : 'update']($scope.resource, 
		function() {	
			$scope.redirectToResource('');
		}, 
		function() {
			$scope.form.saveError = true;
		});
	}

	$scope.delete = function(id) {
		Resource.delete({id: id},
			function() {
				$scope.resources = Resource.query();
			});
	}

	$scope.clear = function() {
		$scope.resource = {id: null, name: null, description: null, resourceTags: null, 
			amount: null, startDate: null, endDate: null, isCommercial: null, isRecurrent: null};
	}

	if($scope.isNew == false) {
		$scope.update(id);
	}

}).controller('OwnResourceController', function($scope, $location, $routeParams, Resource, Account, Organization) {
	
	var orgId;

	Account.get(null, function(account) {
		orgId = account.organizationId;

		$scope.resources = Resource.getByOrgId({id:orgId});
	});

	

});