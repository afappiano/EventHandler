



var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngResource'])
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
.controller('CreateCtrl', ['$routeParams', "$http", '$scope', function CreateCtrl($scope, $http, $routeParams) {
  this.name = 'CreateCtrl';
  this.params = $routeParams;
  this.scope = $scope;

  this.scope.event = {
    // map: ,
    name: "",
    desc: "",
    time: "",
    loc: "",
    attendees: []
    
  }

  //populate page with event to be edited
  this.scope.editEvent = function (ev) {
    this.scope.event = {
      // map: ,
      name: ev.name,
      desc: ev.desc,
      time: ev.time,
      loc: ev.loc,
      attendees: ev.attendees
    }
  },

  //save edited event
  this.scope.saveEvent = function () {
    //
    var parameters = $.param(this.scope.event);

    $http({
      method: "POST",
      header: {
        'Content-Type': "application/json",
      },
      url: 'http://localhost:3000/api/events/edit?'+parameters,
      data: parameters
    }).then(function(res) {
      console.log("Event saved");
    },
    function(res) {
      console.log('error', res);
    });
  }

  //save new event
  this.scope.createEvent = function () {

    var parameters = $.param(this.scope.event);

    $http({
      method: "POST",
      header: {
        'Content-Type': "application/json",
      },
      url: 'http://localhost:3000/api/events/new?'+parameters,
      data: parameters
    }).then(function(res) {
      console.log("Event created");
    },
    function(res) {
      console.log('error', res);
    });


  }
  

}])
.controller('AttendCtrl', ['$routeParams', function AttendCtrl($routeParams) {
  this.name = 'AttendCtrl';
  this.params = $routeParams;
}])
.controller('RegCtrl', ['$routeParams', function RegCtrl($routeParams) {
  this.name = 'RegCtrl';
  this.params = $routeParams;
}])
.controller('ManageCtrl', ['$routeParams', '$scope', function  ManageCtrl($scope, $routeParams) {
  this.name = 'ManageCtrl';
  this.params = $routeParams;
  this.scope = $scope;
  this.scope.isAccepted = function(num){
    // if (/*pending*/) return 0;
    // if (/*declined*/) return 1;
    // if (/*accepted*/)
    console.log(num);
    return num;
  }
}]);



$(document).ready(function () {
  app.p

});