/// <reference path="../../shared/service/commonService.js" />
/// <reference path="C:\Users\lumin\documents\visual studio 2015\Projects\Phaokhoimau_Webshop\WebShop.Web\Assets/admin/libs/angular/angular.js" />
/// <reference path="../../shared/service/notificationService.js" />

(function (app) {
    app.controller('postCategoryEditController', postCategoryEditController);
    //    //$inject các giá trị vào để khi khởi tạo nó sẽ tự được tạo ra theo cơ chế dependency injection
    //    //$state để điều huớng, $stateParams để get param từ state của ui router
    postCategoryEditController.$inject = ['$scope','$state','$stateParams','notificationService','commonService','apiService'];
    function postCategoryEditController($scope,$state,$stateParams,notificationService,commonService,apiService) {
        $scope.postCategory = {
            UpdatedDate : new Date(),
            UpdatedBy: null
        }
        $scope.UpdatePostCategory = UpdatePostCategory;
        $scope.GetSeoTitle = GetSeoTitle;
        $scope.ckeditorOptions = {
            language: 'vi',
            height: '200px',

        }
        $scope.ChooseImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.postCategory.Image = fileUrl;
                })
            }
            finder.popup();

        }

        function GetSeoTitle() {
            $scope.postCategory.Alias = commonService.getSeoTitle($scope.postCategory.Name);
        }

        function loadPostCategoryDetail() {
            apiService.get('api/postcategory/getbyid/' + $stateParams.id, null, function (result) {
                $scope.postCategory = result.data;
                $scope.postCategory.UpdatedDate = new Date();
            }, function (error) {
                notificationService.displayError(error.data)
            });
        }

        function UpdatePostCategory() {
            apiService.put('api/postcategory/update', $scope.postCategory, function (result) {
                notificationService.displaySuccess(result.data.Name + ' đã được cập nhật!');
                $state.go('post_categories');
            }, function (error) {
                notificationService.displayError('Không thể cập nhật đuộc danh mục bài viết!');
            });
        }

        function loadParentCategory() {
            apiService.get('api/postcategory/getallparents', null, function (result) { $scope.parentCategories = result.data; }, function (error) { console.log('Không load được postcategory');});
        }
        loadParentCategory();
        loadPostCategoryDetail();
    }
})(angular.module('webshop.post_categories'));
