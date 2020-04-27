
var current_user;


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
      .when('/edit', {
        templateUrl: 'event_form.html',
        controller: 'CreateCtrl',
        controllerAs: 'edit'
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
.controller('MainCtrl', ['$route', '$routeParams', '$location', '$scope', 'eventBus',
  function MainCtrl($route, $routeParams, $location, $scope, eventBus) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
    $scope.eventBus = eventBus;

    $scope.newEvent = function () {
      $scope.eventBus.event = null;
    },
    $scope.loginStatus = function () {
      console.log("loginStatus");
      console.log($scope.eventBus.logged);
      if ($scope.eventBus.logged == true) {
        $location.path('/manage');
      } else if ($scope.eventBus.logged == null || $scope.eventBus.logged == undefined) {
        $scope.eventBus.logged = false;
      }
    },
    $scope.logout = function () {
      $scope.eventBus.logged = false;
    }
}])
.controller('LoginCtrl', ['$scope','$http','$routeParams','eventBus', function LoginCtrl($scope, $http, $routeParams, eventBus) {
  this.name = 'LoginCtrl';
  this.params = $routeParams;
  $scope.eventBus = eventBus;

    //save new event
    $scope.signup = function (email, password) {
      //hash password
      var parameters = {
        email: email,
        password: password
      }
      // var parameters = $.param($scope.event);
      // console.log(parameters);
      // JSON.parse(parameters);
      $http({
        method: "POST",
        header: {
          'Content-Type': "application/json",
        },
        url: '/api/user/register',
        data: parameters
      }).then(function(res) {
        console.log(res);
        console.log("User created");

        current_user = email;           // keep track of current user
        console.log(current_user);
        // res.send('/manage');
      },
      function(res) {
        console.log('error', res);
      });
    },
    $scope.login = function (email, password) {
      //hash password
      var parameters = {
        email: email,
        password: password
      }
      // var parameters = $.param($scope.event);
      // console.log(parameters);
      // JSON.parse(parameters);
      $http({
        method: "POST",
        header: {
          'Content-Type': "application/json",
        },
        url: '/api/user/login',
        data: parameters
      }).then(function(res) {
        console.log(res);
        console.log("Logging in");

        current_user = email;           // keep track of current user
        console.log(current_user);
        $scope.eventBus.logged = true;
        console.log($scope.eventBus.logged);
      },
      function(res) {
        console.log('error', res);
        $scope.eventBus.logged = false;
        console.log($scope.eventBus.logged);
      });
    }

  
    
}])
.controller('CreateCtrl', ['$scope','$http','$routeParams', 'eventBus',  function CreateCtrl($scope, $http, $routeParams, eventBus) {
  this.name = 'CreateCtrl';
  this.params = $routeParams;
  // $scope = $scope;
  $scope.eventBus = eventBus;

  $scope.empty = {
    // layout: ,
    name: "",
    desc: "",
    time: "",
    loc: "",
    attendees: [],
    map: {
      components: [],
      labels: []
    }
  },

  $scope.editing = false;

  $scope.sortguests = function(a, b) {
    if (a.email <= b.email) return -1;
    else return 1;
  },

  $scope.populate = function() {
    if ($scope.eventBus.event == null) $scope.event = $scope.empty;
    else {
      $scope.event = $scope.eventBus.event;
      $scope.event.time = new Date($scope.eventBus.event.time);
    }
  },
  
  $scope.newEmail = "";
  $scope.visible = false;

  
  $scope.addAttendee = function () {
    console.log("added");
    $scope.event["attendees"].push({
      email: $scope.newEmail,
      status: "Pending"
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
  // $scope.eventBus = function (ev) {
  //   //choose event
    
  //   $scope.event = {
  //     // layout: ,
  //     name: ev.name,
  //     desc: ev.desc,
  //     time: ev.time,
  //     loc: ev.loc,
  //     attendees: ev.attendees
  //   }
  // },

  //save edited event
  $scope.saveEvent = function () {
    //
    // var parameters = $.param($scope.event);

    $http({
      method: "POST",
      header: {
        'Content-Type': "application/json",
      },
      url: '/api/events/edit',
      data: $scope.event
    }).then(function(res) {
      console.log(res);
      console.log("Event saved");
    },
    function(res) {
      console.log('error', res);
    });
  },

  //save new event
  $scope.createEvent = function () {
    console.log($scope.event);
    // var parameters = $.param($scope.event);

    // JSON.parse(parameters);
    $scope.event.map.components = components;
    $scope.event.map.labels = labels;


    $http({
      method: "POST",
      header: {
        'Content-Type': "application/json",
      },
      url: '/api/events/new',
      data: $scope.event
    }).then(function(res) {
      console.log(res);
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
.controller('ManageCtrl', ['$scope','$http','$routeParams', 'eventBus',  function ManageCtrl($scope, $http, $routeParams, eventBus) {
  this.name = 'ManageCtrl';
  this.params = $routeParams;
  // $scope = $scope;
  $scope.eventBus = eventBus;

  $scope.isAccepted = function(num){
    // if (/*pending*/) return 0;
    // if (/*declined*/) return 1;
    // if (/*accepted*/)
    console.log(num);
    return num;
  },

  $scope.getYourEvents = function() {
    $http({
      method: "GET",
      header: {
        'Content-Type': "application/json",
      },
      url: '/api/events/hosting'
      //,
      // data: $scope.event
    }).then(function(res) {
      // console.log(res);
      console.log("Events found");
      $scope.yourEvents = res.data;
      console.log($scope.yourEvents);
    },
    function(res) {
      console.log('error', res);
    });
  },

  $scope.getInvites = function() {
    $http({
      method: "GET",
      header: {
        'Content-Type': "application/json",
      },
      url: '/api/events/invited'
      //,
      // data: $scope.event
    }).then(function(res) {
      // console.log(res);
      console.log("Events found");
      $scope.yourEvents = res.data;
      console.log($scope.yourEvents);
    },
    function(res) {
      console.log('error', res);
    });
  },

  $scope.editRedirect = function(event) {
    console.log("Redirect...");
    $scope.eventBus.event = event;
    console.log($scope.eventBus.event);
  }

}])
.service('eventBus', function () {
  this.event = null;
  this.logged = null;
});



// $(document).ready(function () {
//   app.p

// });