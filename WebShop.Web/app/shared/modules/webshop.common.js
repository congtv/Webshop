//Dùng để include những thư viện bên ngoài ví dụ như ui.router.js

(function () {
    //Khởi tạo module webshop.common kế thừa từ ui.router.js
    angular.module('webshop.common', ['ui.router','ngBootbox','ngCkeditor'])
})();