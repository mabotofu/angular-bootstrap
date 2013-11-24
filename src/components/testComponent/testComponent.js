angular.module("testComponent", [])
    .directive("testcomponent", function () {
        return {
            restrict: "E",
            templateUrl: "components/testComponent/testComponent.tpl.html"
        };
    });