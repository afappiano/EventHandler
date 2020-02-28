



var app = angular.module('app', ['ngRoute', 'ngAnimate'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })  
      .when('/login', {         // add when login true, false
        templateUrl: 'login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/create', {
        templateUrl: 'event_form.html',
        controller: 'CreateCtrl',
        controllerAs: 'create'
      })
      .when('/manage', {
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



$(document).ready(function () {
  app.p

});