(function (app) {
    app.controller('productCategoryEditController', productCategoryEditController);
    //$inject các giá trị vào để khi khởi tạo nó sẽ tự được tạo ra theo cơ chế dependency injection
    //$state để điều huớng, $stateParams để get param từ state của ui router
    productCategoryEditController.$inject = ['apiService', '$scope', 'notificationService', '$state', '$stateParams', 'commonService'];

    function productCategoryEditController(apiService, $scope, notificationService, $state, $stateParams, commonService) {
        $scope.productCategory = {
            UpdateDate: new Date(),
            //UpdateBy: ??
        }

        $scope.UpdateProductCategory = UpdateProductCategory;
        $scope.GetSeoTitle = GetSeoTitle;
        $scope.moreImages = [];
        //$scope.AddProduct = AddProduct;
        //gasn scope = GetSeoTitle mỗi khi gõ tên => tự sinh ra title
        $scope.GetSeoTitle = GetSeoTitle;
        //configure cho ckeditor
        $scope.ckeditorOptions = {
            language: 'vi',
            height: '200px',

        }

        $scope.ChooseImage = function () {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.productCategory.Image = fileUrl;
                })
            }
            finder.popup();

        }

        function GetSeoTitle() {
            $scope.productCategory.Alias = commonService.getSeoTitle($scope.productCategory.Name);
        }

        function loadProductCategoryDetail() {
            apiService.get('api/productcategory/getbyid/' + $stateParams.id, null, function (result) {
                $scope.productCategory = result.data; //gán biến productCategory trong scope = result vừa lấy được từ api getbyid
            }, function (error) {
                notificationService.displayError(error.data);
            });
        }

        function UpdateProductCategory() {
            apiService.put('api/productcategory/update', $scope.productCategory,
                function (result) {
                    notificationService.displaySuccess(result.data.Name + ' đã được cập nhật.');
                    //$state là đối tượng của ui-router để điều huớng
                    $state.go('product_categories');
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                });
        }
        function loadParentCategory() {
            apiService.get('api/productcategory/getallparents', null, function (result) {
                $scope.parentCategories = result.data;
            }, function () {
                console.log('Cannot get list parent');
            });
        }

        loadParentCategory();
        loadProductCategoryDetail();
    }

})(angular.module('webshop.product_categories'));// phụ thuộc module product_categories