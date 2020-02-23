



var app = angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/eventhandler/login', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/eventhandler/create', {
        templateUrl: 'event_form.html',
        controller: 'CreateCtrl',
        controllerAs: 'create'
      })
      .when('/eventhandler/manage', {
        templateUrl: 'event_man.html',
        controller: 'ManageCtrl',
        controllerAs: 'manage'
      });

    $locationProvider.html5Mode(true);
}])
.controller('MainCtrl', ['$route', '$routeParams', '$location',
  function MainCtrl($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
}])
.controller('LoginCtrl', ['$routeParams', function LoginCtrl($routeParams) {
  this.name = 'LoginCtrl';
  this.params = $routeParams;
}])
.controller('CreateCtrl', ['$routeParams', function CreateCtrl($routeParams) {
  this.name = 'CreateCtrl';
  this.params = $routeParams;
}])
.controller('ManageCtrl', ['$routeParams', function  ManageCtrl($routeParams) {
  this.name = 'ManageCtrl';
  this.params = $routeParams;
}]);