(function (app) {
    app.controller('productCategoryListController', productCategoryListController);

    productCategoryListController.$inject = ['$scope','apiService','notificationService','$ngBootbox','$filter'];

function productCategoryListController($scope, apiService,notificationService,$ngBootbox,$filter) {
        $scope.productCategories = [];
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.getProductCagories = getProductCagories;
        $scope.keyword = '';

        $scope.search = search;

        $scope.deleteProductCategory = deleteProductCategory;
        
        $scope.selectAll = selectAll;

        $scope.deleteMultiple = deleteMultiple;

        function deleteMultiple() {
            var listId = [];
            $.each($scope.selected, function (i, item) {
                listId.push(item.ID);
            });
            var config = {
                params: {
                    checkedProductCategories: JSON.stringify(listId)
                }
            }
            apiService.del('api/productcategory/deletemulti', config, function (result) {
                notificationService.displaySuccess('Xoá thành công ' + result.data + ' bản ghi!');
                search();
            }, function (error) {
                notificationService.displayWarning('Xoá không thành công!');
            });
        }

        $scope.isAll = false;
        function selectAll() {
            if ($scope.isAll == false) {
                angular.forEach($scope.productCategories, function (item) {
                    item.checked = true;
                });
                $scope.isAll = true;
            } else {
                angular.forEach($scope.productCategories, function (item) {
                    item.checked = false;
                });
                $scope.isAll = false;
            }
        }
        //áp dụng $watch cho $scope, lắng nghe sự thay đổi của productCategories
        //có 2 tham số 1 là biến 2 là function ( new, old)
        //filter danh sách chỉ những phần tử mới có checked : true gán vào biến checked
        //nếu biến checked có độ dài thì thực hiện scope.....
        $scope.$watch('productCategories', function (n, o) {
            var checked = $filter('filter')(n, { checked: true });
            if (checked.length) {
                $scope.selected = checked;
                $('#btnDelete').removeAttr('disabled');
            }
            else {
                $('#btnDelete').attr('disabled', 'disabled');
            }
        },true)

        //phương thức xóa 1 bản ghi
        function deleteProductCategory(id) {
            $ngBootbox.confirm('Bạn có chắc muốn xóa?').then(function () {
                var config = {
                    params: {
                        id: id
                    }
                }
                apiService.del('api/productcategory/delete', config, function () {
                    notificationService.displaySuccess('Xóa thành công');
                    search();
                }, function () {
                    notificationService.displayWarning('Xóa không thành công');
                })
            });
        }
        
        //phương thức search dựa theo $scope.keyword truỳen vào
        function search() {
            getProductCagories();
        }
        function getProductCagories(page) {
            page = page || 0;
            var config = {
                params: {
                    keyword:$scope.keyword,
                    page: page,
                    pageSize: 6
                }
            }
            apiService.get('/api/productcategory/getall', config, function (result) {
                if (result.data.TotalCount === 0) {
                    notificationService.displayWarning('Không có bản ghi nào được tìm thấy.');
                }
                $scope.productCategories = result.data.Items;
                $scope.page = result.data.Page;
                $scope.pagesCount = result.data.TotalPages;
                $scope.totalCount = result.data.TotalCount;
            }, function () {
                console.log('Load productcategory failed.');
            });
        }

        $scope.getProductCagories();
    }
})(angular.module('webshop.product_categories')); 