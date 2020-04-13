



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
.controller('CreateCtrl', ['$scope','$http','$routeParams',   function CreateCtrl($scope, $http, $routeParams) {
  this.name = 'CreateCtrl';
  this.params = $routeParams;
  // $scope = $scope;

  $scope.sortguests = function(a, b) {
    if (a.email <= b.email) return -1;
    else return 1;
  },

  $scope.event = {
    // layout: ,
    "name": "",
    "desc": "",
    "time": "",
    "loc": "",
    "attendees": []
  },
  $scope.newEmail = "";
  $scope.visible = false;

  
  $scope.addAttendee = function () {
    console.log("added");
    $scope.event.attendees.push({
      "email": $scope.newEmail,
      "status": "Pending"
    });
    // 0 = pending, 1 = accepted, 2 = declined
    $scope.newEmail = "";
    $scope.visible = false;
    $scope.event.attendees.sort(function(a,b) {
      $scope.sortguests(a,b);
    });
  },

  $scope.removeAttendee = function (item) {
    var index = $scope.event.attendees.indexOf(item);
    $scope.event.attendees.splice(index,1);
  },

  //populate page with event to be edited
  $scope.editEvent = function (ev) {
    $scope.event = {
      // layout: ,
      "name": ev.name,
      "desc": ev.desc,
      "time": ev.time,
      "loc": ev.loc,
      "attendees": ev.attendees
    }
  },

  //save edited event
  $scope.saveEvent = function () {
    //
    var parameters = $.param($scope.event);

    $http({
      method: "POST",
      header: {
        'Content-Type': "application/json",
      },
      url: '/api/events/edit?'+parameters,
      data: parameters
    }).then(function(res) {
      console.log("Event saved");
    },
    function(res) {
      console.log('error', res);
    });
  }

  //save new event
  $scope.createEvent = function () {
    console.log($scope.event);
    var parameters = $.param($scope.event);
    console.log(parameters);

    $http({
      method: "POST",
      header: {
        'Content-Type': "application/json",
      },
      url: '/api/events/new',
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
  // $scope = $scope;
  $scope.isAccepted = function(num){
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