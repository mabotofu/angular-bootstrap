"use strict";

describe("Controller: mainCtrl", function () {

    // load the controller"s module
    beforeEach(module("bootstrap"));

    var mainCtr,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        mainCtr = $controller("mainCtr", {
            $scope: scope
        });
    }));

    it("should have \"text\" in the scope", function () {
        console.log(scope)
        expect(typeof scope.text).toBe("string");
    });
});
