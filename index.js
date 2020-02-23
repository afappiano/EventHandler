




var app = angular.module("app", ["ngResource"]);

app.controller("ctrl", ["$scope", "$http", function($scope, $http) {
	
		
		$http({
			method: "GET",
			header: {
				'Content-Type': "application/json",
			},
			url: $scope.link,
		}).then(function(res) {
			console.log(res);

		},
		function(res) {
			console.log('error', res);
		});
	


	$(document).ready(function () {


	});
}]);


