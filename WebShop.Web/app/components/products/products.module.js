/// <reference path="C:\Users\lumin\documents\visual studio 2015\Projects\Phaokhoimau_Webshop\WebShop.Web\Assets/admin/libs/angular/angular.js" />

(function () { 
	angular.module('webshop.products', ['webshop.common']).config(config);
	config.$inject = ['$stateProvider', '$urlRouterProvider'];

    //Khai báo router
	function config($stateProvider, $urlRouterProvider) {
	    $stateProvider
            .state('products', {
            //mỗi khi request đến /products thì sẽ chạy đến controller productListController và chạy template productListView.html mà ko cần refresh lại trang web
                url: "/products",
                parent: 'base',
			    templateUrl: "/app/components/products/productListView.html",
			    controller: "productListController"
		    }).state('product_add', {
		        url: "/product_add",
		        parent: 'base',
			    templateUrl: "/app/components/products/productAddView.html",
			    controller: "productAddController"
		    }).state('product_edit', {
                //edit phải truyền thêm tham số id để controller get detail cho sản phẩm
		        url: "/product_edit/:id",
		        parent: 'base',
		        templateUrl: "/app/components/products/productEditView.html",
		        controller: "productEditController"
		    });
	    }
    })();