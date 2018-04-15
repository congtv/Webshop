using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebShop.Model.Models;
using WebShop.Service;
using WebShop.Web.Models;

namespace WebShop.Web.Controllers
{
    public class HomeController : Controller
    {
        IProductCategoryService _productCategoryService;
        IProductService _productService;
        public HomeController(IProductService productService,IProductCategoryService productCategoryService)
        {
            _productCategoryService = productCategoryService;
            _productService = productService;
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        [ChildActionOnly]
        public ActionResult Category()
        {
            var model = _productCategoryService.GetAll().Where(x=>x.Status == true).OrderBy(x=>x.DisplayOrder);
            var listProductCategoryViewModel = Mapper.Map<IEnumerable<ProductCategory>, IEnumerable<ProductCategoryViewModel>>(model);
            return PartialView(listProductCategoryViewModel);
        }

        [ChildActionOnly]   //Chỉ được nhúng, không được gọi trực tiếp
        public ActionResult Footer()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult Header()
        {
            var model = _productCategoryService.GetAll().Where(x => x.Status == true && x.HomeFlag == true).OrderBy(x=>x.DisplayOrder);
            var listProductCategoryViewModel = Mapper.Map<IEnumerable<ProductCategory>, IEnumerable<ProductCategoryViewModel>>(model);
            return PartialView(listProductCategoryViewModel);
        }
        [ChildActionOnly]
        public ActionResult Slide()
        {
            return PartialView();
        }
        [ChildActionOnly]
        public ActionResult HotProduct()
        {
            var model = _productService.GetAll().Where(x => x.Status == true || x.PromotionPrice != null || x.PromotionPrice > 0 || x.HotFlag == true).OrderBy(x => x.CreatedDate).OrderBy(x=>x.UpdatedDate).ThenBy(x=>x.ViewCount).Take(10);
            var listProductViewModel = Mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(model);
            return PartialView(listProductViewModel);
        }
    }
}