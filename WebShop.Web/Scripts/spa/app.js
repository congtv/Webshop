/// <reference path="../plugins/angular/angular.js" />

var admin = angular.module('Admin', []);

admin.service('validator', Validator);
admin.controller("AdminController", function adminController($scope,validator) {
    $scope.num = 0;
    $scope.text = "";
    $scope.CheckNumber = function () {
        $scope.message1 = Validator.checkNumber($scope.num);
    }
    $scope.CheckLength = function () {
        $scope.message2 = Validator.checkLengthOfText($scope.text);
    }

});

//truyền đối tượng scope vào controller
admin.$inject = ['$scope','Validator'];

//viết function của service
function Validator($window) {
    return {
        checkNumber: checkNumber, checkLengthOfText
    }
    function checkNumber(input) {
        if(input%2==0)
            return 'this is even'
        else
            return 'this is odd'
    }
    function checkLengthOfText(input) {
        return input
    }
};