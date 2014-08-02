app = angular.module('App',
        ['ngResource', 'ngRoute', 'ngStorage', 'ngAnimate', 'mgcrea.ngStrap', 'vintagejs', 'ngTouch']);

app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }]);