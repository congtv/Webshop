(function(app){
    app.controller('postCategoryAddController',postCategoryAddController);
    postCategoryAddController.$inject = ['$scope','apiService','notificationService','$state','commonService'];
    function postCategoryAddController($scope,apiService,notificationService,$state,commonService)
    {
        $scope.postCategory = {
            CreatedDate: new Date(),
            Status: true
        }
        $scope.AddPostCategory = AddPostCategory;
        $scope.GetSeoTitle = GetSeoTitle;
        $scope.ListError = [];

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


        function AddPostCategory()
        {
            $('input[name="name"]').parents('div[class="col-sm-10"]').removeClass('has-error');
            $('input[name="alias"]').parents('div[class="col-sm-10"]').removeClass('has-error');
            $scope.ListError = [];
            if ($scope.postCategory.Name == null)
            {
                $scope.ListError.push('Tên danh mục bài viết không được để trống!');
                $('input[name="name"]').parents('div[class="col-sm-10"]').addClass('has-error');
            }
            if ($scope.postCategory.Alias == null) {
                $scope.ListError.push('Tiêu đề Seo không được để trống!');
                $('input[name="alias"]').parents('div[class="col-sm-10"]').addClass('has-error');
            }
            if ($scope.postCategory.Name != null && $scope.postCategory.Alias != null)
            {

                    apiService.post('api/postcategory/create', $scope.postCategory,
                    function (result) {
                        notificationService.displaySuccess(result.data.Name + ' đã được thêm mới vào danh mục bài viết!');

                        $state.go('post_categories');
                    }
                    , function (error) {
                        notificationService.displayError('Thêm mới danh mục bài viết không thành công!');
                    });
                }

        }
        function loadParentCategory() {
            apiService.get('/api/postcategory/getallparents', null, function (result) { $scope.parentCategories = result.data;}, function () { console.log('Can get list parent')});
        }
        function GetSeoTitle() {
            $scope.postCategory.Alias = commonService.getSeoTitle($scope.postCategory.Name);
        }
        loadParentCategory();
    }
})(angular.module('webshop.post_categories'));