'use strict';

respondecoApp.controller('ResourceController', function($scope, $location, $routeParams, Resource, Account, Organization) {

	$scope.resource = {resourceTags: [], isCommercial: false, isRecurrent: false};
	$scope.organization = null;
	$scope.formSaveError = null;
	$scope.selectedTags = [];

	$scope.resourceSearch = {name: null, company: null};

	var id = $routeParams.id;
	$scope.isNew = id === 'new';


	if($location.path() === 'ownresource') {
		Account.get(null, function(account) {
			orgId = account.organizationId;

			$scope.resources = Resource.getByOrgId({id:orgId});
		});
	} else {
		$scope.resources = Resource.query();
	}


	Account.get(null, function(account) {
		$scope.resource.organizationId = account.organizationId;

		$scope.organization = Organization.get({id: account.organizationId}, function(organization) {
			$scope.organization = organization;
		});
	});

	$scope.redirectToResource = function(id) {
		$location.path('resource/' + id);
	}

	$scope.search = function() {
		Resource.query({
				name: $scope.resourceSearch.name, 
				company: $scope.resourceSearch.company
			}, function(res) {
				$scope.resources = res;
			}, function(error) {
				$scope.searchError = true;
			});
	}

	$scope.create = function() {
		$scope.resource.resourceTags = $.map($scope.selectedTags, function(tag) {return tag.name});
		console.log($.map($scope.resource.resourceTags, function(tag) {return {name: tag}}));

		Resource[$scope.isNew ? 'save' : 'update']($scope.resource, 
		function() {	
			$scope.redirectToResource('');
		}, 
		function() {
			$scope.formSaveError = true;
		});
	}

	$scope.delete = function(id) {
		Resource.delete({id: id},
			function() {
				$scope.resources = Resource.query();
			});
	}

	$scope.update = function(id) {
		Resource.get({id: id}, function(resource) {
			$scope.resource = resource;
			$scope.selectedTags = $.map($scope.resource.resourceTags, function(tag) {return {name: tag}}); //string-array to object-array

		}, function() {
			$scope.redirectToResource('new');
		});
	}

	$scope.clear = function() {
		$scope.resource = {id: null, name: null, description: null, resourceTags: [], 
			amount: null, startDate: null, endDate: null, isCommercial: false, isRecurrent: false};
	}

	if($scope.isNew == false) {
		$scope.update(id);
	}

});