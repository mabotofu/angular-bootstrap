"use strict";
angular.module("bootstrap:foo", ["ngRoute", "testComponent"])
    .config(function ($routeProvider) {
        $routeProvider.when("/foo", {
            templateUrl: "app/foo/foo.tpl.html",
            controller: "fooCtr"
        });
    })
    .controller("fooCtr", function($scope) {
        $scope.text = "This is foo";
    });