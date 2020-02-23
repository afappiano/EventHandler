




var app = angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/Book/:bookId', {
        templateUrl: 'event_form.html',
        controller: 'BookCtrl',
        controllerAs: 'book'
      })
      .when('/Book/:bookId/ch/:chapterId', {
        templateUrl: 'chapter.html',
        controller: 'ChapterCtrl',
        controllerAs: 'chapter'
      });

    $locationProvider.html5Mode(true);
}])
.controller('MainCtrl', ['$route', '$routeParams', '$location',
  function MainCtrl($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
}])
.controller('FormCtrl', ['$routeParams', function BookCtrl($routeParams) {
  this.name = 'FormCtrl';
  this.params = $routeParams;
}])
.controller('ChapterCtrl', ['$routeParams', function ChapterCtrl($routeParams) {
  this.name = 'ChapterCtrl';
  this.params = $routeParams;
}]);