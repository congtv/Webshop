(function (app) {
    app.controller('postCategoryListController', postCategoryListController);

    postCategoryListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter'];

    function postCategoryListController($scope, apiService, notificationService, $ngBootbox, $filter) {
        $scope.postCategories = [];
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.getPostCagories = getPostCagories;
        $scope.keyword = '';

        $scope.search = search;

        $scope.deletePostCategory = deletePostCategory;

        $scope.selectAll = selectAll;

        $scope.deleteMultiple = deleteMultiple;

        function deleteMultiple() {
            var listId = [];
            $.each($scope.selected, function (i, item) {
                listId.push(item.ID);
            });
            var config = {
                params: {
                    checkedPostCategories: JSON.stringify(listId)
                }
            }
            apiService.del('api/postcategory/deletemulti', config, function (result) {
                notificationService.displaySuccess('Xoá thành công ' + result.data + ' bản ghi!');
                search();
            }, function (error) {
                notificationService.displayWarning('Xoá không thành công!');
            });
        }

        $scope.isAll = false;
        function selectAll() {
            if ($scope.isAll == false) {
                angular.forEach($scope.postCategories, function (item) {
                    item.checked = true;
                });
                $scope.isAll = true;
            } else {
                angular.forEach($scope.postCategories, function (item) {
                    item.checked = false;
                });
                $scope.isAll = false;
            }
        }
        //áp dụng $watch cho $scope, lắng nghe sự thay đổi của posttCategories
        //có 2 tham số 1 là biến 2 là function ( new, old)
        //filter danh sách chỉ những phần tử mới có checked : true gán vào biến checked
        //nếu biến checked có độ dài thì thực hiện scope.....
        $scope.$watch('postCategories', function (n, o) {
            var checked = $filter('filter')(n, { checked: true });
            if (checked.length) {
                $scope.selected = checked;
                $('#btnDelete').removeAttr('disabled');
            }
            else {
                $('#btnDelete').attr('disabled', 'disabled');
            }
        }, true)

        //phương thức xóa 1 bản ghi
        function deletePostCategory(id) {
            $ngBootbox.confirm('Bạn có chắc muốn xóa?').then(function () {
                var config = {
                    params: {
                        id: id
                    }
                }
                apiService.del('api/postcategory/delete', config, function () {
                    notificationService.displaySuccess('Xóa thành công');
                    search();
                }, function () {
                    notificationService.displayWarning('Xóa không thành công');
                })
            });
        }

        //phương thức search dựa theo $scope.keyword truỳen vào
        function search() {
            getPostCagories();
        }
        function getPostCagories(page) {
            page = page || 0;
            var config = {
                params: {
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: 6
                }
            }
            apiService.get('/api/postcategory/getall', config, function (result) {
                if (result.data.TotalCount === 0) {
                    notificationService.displayWarning('Không có bản ghi nào được tìm thấy.');
                }
                $scope.postCategories = result.data.Items;
                $scope.page = result.data.Page;
                $scope.pagesCount = result.data.TotalPages;
                $scope.totalCount = result.data.TotalCount;
            }, function () {
                console.log('Load postcategory failed.');
            });
        }

        $scope.getPostCagories();
    }
})(angular.module('webshop.post_categories'));