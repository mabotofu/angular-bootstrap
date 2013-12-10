"use strict";
angular.module("bootstrap.bar", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider.when("/bar", {
            templateUrl: "app/bar/bar.tpl.html",
            controller: "BarCtrl"
        });
    })
    .controller("BarCtrl", function($scope, barService) {
        $scope.text = "This is bar!";
        $scope.barService = barService;
    });