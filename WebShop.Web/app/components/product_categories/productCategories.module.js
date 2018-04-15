/// <reference path="C:\Users\lumin\documents\visual studio 2015\Projects\Phaokhoimau_Webshop\WebShop.Web\Assets/admin/libs/angular/angular.js" />

(function () {
    //Khởi tạo module
    angular.module('webshop.product_categories', ['webshop.common']).config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    //Khai báo router
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider.state('product_categories', {
            //mỗi khi request đến /products thì sẽ chạy đến controller productListController và chạy template productListView.html mà ko cần refresh lại trang web
            url: "/products_categories",
            parent: 'base',
            templateUrl: "/app/components/product_categories/productCategoryListView.html",
            controller: "productCategoryListController"
        }).state('add_product_category', {
            url: "/add_products_category",
            parent: 'base',
            templateUrl: "/app/components/product_categories/productCategoryAddView.html",
            controller: "productCategoryAddController"
        }).state('edit_product_category', {
            url: "/edit_products_category/:id",
            parent: 'base',
            templateUrl: "/app/components/product_categories/productCategoryEditView.html",
            controller: "productCategoryEditController"
        });
    }
})();