"use strict";
angular.module("bootstrap", [
        "templates-main",
        "ngRoute",
        "bootstrap:foo",
        "bootstrap:bar"
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/",{
                templateUrl: "app/app.tpl.html",
                controller: "mainCtr"
            })
            .otherwise({
                redirectTo: "/"
            });
    })
    .controller("mainCtr", function ($scope) {
        $scope.text = "This is the app!";
    });
