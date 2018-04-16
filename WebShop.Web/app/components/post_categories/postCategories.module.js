
(function () {
	//Khởi tạo module
	angular.module('webshop.post_categories', ['webshop.common']).config(config);
	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	//Khai báo router
	function config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('post_categories', {
			//mỗi khi request đến /posts thì sẽ chạy đến controller postListController và chạy template postListView.html mà ko cần refresh lại trang web
		    url: "/posts_categories",
		    parent: 'base',
			templateUrl: "/app/components/post_categories/postCategoryListView.html",
			controller: "postCategoryListController"
		}).state('add_post_category', {
		    url: "/add_posts_category",
		    parent: 'base', //Kế thừa từ thằng base ở trong app.js, sau khi kế thừa thì add_post_category sẽ có thêm baseView.html
			templateUrl: "/app/components/post_categories/postCategoryAddView.html",
			controller: "postCategoryAddController"
		}).state('edit_post_category', {
		    url: "/edit_posts_category/:id",
		    parent: 'base',
			templateUrl: "/app/components/post_categories/postCategoryEditView.html",
			controller: "postCategoryEditController"
		});
	}
})();