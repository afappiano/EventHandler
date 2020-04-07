



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
      .when('/attending', {
        templateUrl: 'attendee_view.html',
        controller: 'AttendCtrl',
        controllerAs: 'attending'
      })
      .when('/register', {
        templateUrl: 'attendee_reg.html',
        controller: 'RegCtrl',
        controllerAs: 'register'
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
.controller('AttendCtrl', ['$routeParams', function AttendCtrl($routeParams) {
  this.name = 'AttendCtrl';
  this.params = $routeParams;
}])
.controller('RegCtrl', ['$routeParams', function RegCtrl($routeParams) {
  this.name = 'RegCtrl';
  this.params = $routeParams;
}])
.controller('ManageCtrl', ['$routeParams', function  ManageCtrl($routeParams) {
  this.name = 'ManageCtrl';
  this.params = $routeParams;
  this.$scope.isAccepted = function(/**/){
    // if (/*pending*/) return 0;
    // if (/*declined*/) return 1;
    // if (/*accepted*/)
    return 2;
  }
}]);



$(document).ready(function () {
  app.p

});