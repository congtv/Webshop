(function (app) {
    app.controller('productEditController', productEditController);
    productEditController.$inject = ['$scope', 'apiService', 'notificationService', '$state','$stateParams', 'commonService']
    function productEditController($scope, apiService, notificationService, $state,$stateParams, commonService) {
        $scope.product = {
            CreatedDate: new Date(),
            Status: true
        }
        $scope.moreImages = [];

        $scope.UpdateProduct = UpdateProduct;
        //gasn scope = GetSeoTitle mỗi khi gõ tên => tự sinh ra title
        $scope.GetSeoTitle = GetSeoTitle;
        //configure cho ckeditor
        $scope.ckeditorOptions = {
            language: 'vi',
            height: '200px',

        }


        $scope.ChooseMoreImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    //if ($scope.moreImages === null) {
                    //    $scope.moreImages[0] = fileUrl;
                    //}
                    //else {
                        $scope.moreImages.push(fileUrl);
                    //}
                    
                })
            }
            finder.popup();
        }

        $scope.ChooseImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.product.Image = fileUrl;
                })
            }
            finder.popup();

        }
        //Remmove image from list more image
        $scope.RemoveImage = function () {
            var url = this.img;
            $.each($scope.moreImages, function (index, value) {
                if (url == value) {
                    $scope.moreImages.splice(index);
                }
            });

        }
        function loadProductDetail() {
            apiService.get('api/product/getbyid/' + $stateParams.id, null, function (result) {
                $scope.product = result.data; //gán biến productCategory trong scope = result vừa lấy được từ api getbyid
                if ($scope.product.MoreImages === "null" || $scope.product.MoreImages === null) {
                    $scope.moreImages = [];
                }
                else {
                    $scope.moreImages = JSON.parse($scope.product.MoreImages);
                }
                
            }, function (error) {
                notificationService.displayError(error.data);
            });
        }

        function GetSeoTitle() {
            $scope.product.Alias = commonService.getSeoTitle($scope.product.Name);
        }
        function UpdateProduct() {
            $scope.product.MoreImages = JSON.stringify($scope.moreImages);
            apiService.put('api/product/update', $scope.product,
                function (result) {
                    notificationService.displaySuccess(result.data.Name + ' đã được cập nhật.');
                    //$state là đối tượng của ui-router để điều huớng
                    $state.go('products');
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                });
        }
        function loadProductCategory() {
            apiService.get('/api/productcategory/getallparents', null, function (result) {
                $scope.productCategories = result.data;
            }, function () {
                console.log('Cannot get list categories')
            });
        }

        loadProductCategory();
        loadProductDetail();
    }
})(angular.module('webshop.products'));