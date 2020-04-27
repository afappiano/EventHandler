
var current_user;
var empty = {
  name: "",
  desc: "",
  time: "",
  loc: "",
  attendees: [],
  map: {
    components: [],
    labels: []
  }
};


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
.controller('MainCtrl', ['$route', '$routeParams', '$location', '$scope', 'editEvent','$http',
  function MainCtrl($route, $routeParams, $location, $scope, editEvent, $http) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
    $scope.editEvent = editEvent;

    $scope.newEvent = function () {
      $scope.editEvent.event = null;
    },

    $scope.logout = function () {
      console.log("logout");
      $http({
        method: "DELETE",
        header: {
          'Content-Type': "application/json",
        },
        url: '/api/user/logout'
      }).then(function(res) {
        console.log(res);
        // $scope.loginStatus();
        $location.path('/');
      },
      function(res) {
        console.log('error', res);
      });
    },
    $scope.$on('$locationChangeSuccess', function () {
      // console.log('$locationChangeSuccess');
      // $scope.loginStatus();
      $http({
        method: "GET",
        header: {
          'Content-Type': "application/json",
        },
        url: '/api/user/isLoggedIn'
      }).then(function(res) {
        // console.log(res);
        $scope.logged = res.data.isLoggedIn;
        // console.log($scope.logged);
        if ($scope.logged == false) {
          $location.path('/');
        }
      },
      function(res) {
        console.log('error', res);
      });
    });

}])
.controller('LoginCtrl', ['$scope','$http','$routeParams','editEvent', '$location', function LoginCtrl($scope, $http, $routeParams, editEvent, $location) {
  this.name = 'LoginCtrl';
  this.params = $routeParams;
  $scope.editEvent = editEvent;

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
        $scope.logged = true;
        console.log($scope.logged);
        
        $location.path('/manage');
      },
      function(res) {
        console.log('error', res);
        $scope.logged = false;
        console.log($scope.logged);
      });
    }

  
    
}])
.controller('CreateCtrl', ['$scope','$http','$routeParams', 'editEvent', function CreateCtrl($scope, $http, $routeParams, editEvent) {
  this.name = 'CreateCtrl';
  this.params = $routeParams;
  // $scope = $scope;
  $scope.editEvent = editEvent;

  $scope.editing = false;

  $scope.sortguests = function(a, b) {
    if (a.email <= b.email) return -1;
    else return 1;
  },

  $scope.populate = function() {
    console.log("POPULATE");
    components = [];
    labels = [];
    if ($scope.editEvent.event == null) $scope.event = empty;
    else {
      $scope.event = $scope.editEvent.event;
      $scope.event.time = new Date($scope.editEvent.event.time);
      startBuild();
      for (var i = 0; i < $scope.event.map.components.length; i++) {
        var current = $scope.event.map.components[i];
        if ($scope.event.map.components[i].type === "Rectangle") {
          components.push(new rectangle(current.width, current.height, current.color, current.x, current.y));
        } else if ($scope.event.map.components[i].type === "Circle") {
          components.push(new circle(current.radius, current.color, current.x, current.y));
        } else if ($scope.event.map.components[i].type === "Text") {
          components.push(new text(current.color, current.x, current.y, current.label));
        }
      }
      labels = $scope.event.map.labels;
      for (var i = 0; i < $scope.event.map.labels.length; i++) {
        $("#labels").append("<option onclick='makeLabel(\"" + $scope.event.map.labels[i] + "\")' value='" + $scope.event.map.labels[i] + "' id='" + $scope.event.map.labels[i] + "'>" + $scope.event.map.labels[i] + "</option>")
      }
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

  //save edited event
  $scope.saveEvent = function () {
    //
    // var parameters = $.param($scope.event);
    $scope.event.map.components = components;
    $scope.event.map.labels = labels;

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
.controller('AttendCtrl', ['$scope','$http','$routeParams', 'editEvent',  function CreateCtrl($scope, $http, $routeParams, editEvent) {
  this.name = 'AttendCtrl';
  this.params = $routeParams;
  // $scope = $scope;
  $scope.editEvent = editEvent;

  $scope.editing = false;

  $scope.sortguests = function(a, b) {
    if (a.email <= b.email) return -1;
    else return 1;
  },

  $scope.populate = function() {
    console.log("POPULATE");
    components = [];
    if ($scope.editEvent.event == null) $scope.event = empty;
    else {
      $scope.event = $scope.editEvent.event;
      $scope.event.time = new Date($scope.editEvent.event.time);
      for (var i = 0; i < $scope.event.map.components.length; i++) {
        var current = $scope.event.map.components[i];
        if ($scope.event.map.components[i].type === "Rectangle") {
          components.push(new rectangle(current.width, current.height, current.color, current.x, current.y));
        } else if ($scope.event.map.components[i].type === "Circle") {
          components.push(new circle(current.radius, current.color, current.x, current.y));
        } else if ($scope.event.map.components[i].type === "Text") {
          components.push(new text(current.color, current.x, current.y, current.label));
        }
      }
      myArea.start();
      piece = 3;
      console.log(components);
    }
  },

  $scope.editRedirect = function(event) {
    $scope.editEvent.event = empty;
    console.log("Redirect...");
    $scope.editEvent.event = event;
    console.log($scope.editEvent.event);
  }
  
  $scope.newEmail = "";
  $scope.visible = false;

  

}])
.controller('RegCtrl', ['$scope','$http','$routeParams', 'editEvent',  function CreateCtrl($scope, $http, $routeParams, editEvent) {
  this.name = 'RegCtrl';
  this.params = $routeParams;
  // $scope = $scope;
  $scope.editEvent = editEvent;

  $scope.editing = false;

  $scope.sortguests = function(a, b) {
    if (a.email <= b.email) return -1;
    else return 1;
  },

  $scope.populate = function() {
    console.log("POPULATE");
    components = [];
    if ($scope.editEvent.event == null) $scope.event = empty;
    else {
      $scope.event = $scope.editEvent.event;
      $scope.event.time = new Date($scope.editEvent.event.time);
      for (var i = 0; i < $scope.event.map.components.length; i++) {
        var current = $scope.event.map.components[i];
        if ($scope.event.map.components[i].type === "Rectangle") {
          components.push(new rectangle(current.width, current.height, current.color, current.x, current.y));
        } else if ($scope.event.map.components[i].type === "Circle") {
          components.push(new circle(current.radius, current.color, current.x, current.y));
        } else if ($scope.event.map.components[i].type === "Text") {
          components.push(new text(current.color, current.x, current.y, current.label));
        }
      }
      myArea.start();
      piece = 3;
      console.log(components);
    }
  },

  $scope.editRedirect = function(event) {
    $scope.editEvent.event = empty;
    console.log("Redirect...");
    $scope.editEvent.event = event;
    console.log($scope.editEvent.event);
  }
  
  $scope.newEmail = "";
  $scope.visible = false;
}])
.controller('ManageCtrl', ['$scope','$http','$routeParams','editEvent', function ManageCtrl($scope, $http, $routeParams, editEvent) {
  this.name = 'ManageCtrl';
  this.params = $routeParams;
  // $scope = $scope;
  $scope.editEvent = editEvent;

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
      // console.log("Events found");
      $scope.yourEvents = res.data;
      // console.log($scope.yourEvents);
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
      // console.log("Invites found");
      $scope.invitedEvents = res.data;
      // console.log($scope.invitedEvents);
    },
    function(res) {
      console.log('error', res);
    });
  },

  $scope.editRedirect = function(event) {
    $scope.editEvent.event = empty;
    console.log("Redirect...");
    $scope.editEvent.event = event;
    console.log($scope.editEvent.event);
  }

}])
.service('editEvent', function () {
  this.event = null;
});
