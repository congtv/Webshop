(function (app) {
    app.controller('productAddController', productAddController);
    productAddController.$inject = ['$scope', 'apiService', 'notificationService', '$state', 'commonService']
    function productAddController($scope, apiService, notificationService, $state, commonService) {
        $scope.product = {
            CreatedDate: new Date(),
            Status: true
        }

        $scope.moreImages = [];
        $scope.AddProduct = AddProduct;
        //gasn scope = GetSeoTitle mỗi khi gõ tên => tự sinh ra title
        $scope.GetSeoTitle = GetSeoTitle;
        //configure cho ckeditor
        $scope.ckeditorOptions = {
            language: 'vi',
            height: '200px',

        }

        //Remmove image from list more image
        $scope.RemoveImage = function () {
            var url = this.img;
            $.each($scope.moreImages, function (index,value)
            {
            if (url == value)
            {
                    $scope.moreImages.splice(index);
                }
            });

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

        $scope.ChooseMoreImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.moreImages.push(fileUrl);
                }) 
            }
            finder.popup();
        }
        function GetSeoTitle() {
            $scope.product.Alias = commonService.getSeoTitle($scope.product.Name);
        }
        function AddProduct() {
            $scope.product.MoreImages = JSON.stringify($scope.moreImages);
            apiService.post('api/product/create', $scope.product,
                function (result) {
                    notificationService.displaySuccess(result.data.Name + ' đã được thêm mới.');
                    //$state là đối tượng của ui-router để điều huớng
                    $state.go('products');
                }, function (error) {
                    notificationService.displayError('Thêm mới không thành công.');
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
    }
})(angular.module('webshop.products'));