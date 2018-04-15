/// <reference path="C:\Users\lumin\documents\visual studio 2015\Projects\Phaokhoimau_Webshop\WebShop.Web\Assets/admin/libs/angular/angular.js" />

(function () {
	//Khởi tạo module
	angular.module('webshop.posts', ['webshop.common']).config(config);
	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	//Khai báo router
	function config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('posts', {
			//mỗi khi request đến /posts thì sẽ chạy đến controller postListController và chạy template postListView.html mà ko cần refresh lại trang web
		    url: "/posts",
		    parent: 'base',
			templateUrl: "/app/components/posts/postListView.html",
			controller: "postListController"
		}).state('add_post', {
		    url: "/add_posts",
		    parent: 'base',
			templateUrl: "/app/components/posts/postAddView.html",
			controller: "postAddController"
		}).state('edit_post', {
		    url: "/edit_posts/:id",
		    parent: 'base',
			templateUrl: "/app/components/posts/postEditView.html",
			controller: "postEditController"
		});
	}
})();