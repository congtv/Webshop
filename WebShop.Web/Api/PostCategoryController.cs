using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using WebShop.Model.Models;
using WebShop.Service;
using WebShop.Web.Infrastructure.Core;
using WebShop.Web.Infrastructure.Extensions;
using WebShop.Web.Models;

namespace WebShop.Web.Api
{
    [RoutePrefix("api/postcategory")]
    [Authorize]
    public class PostCategoryController : ApiControllerBase
    {
        IPostCategoryService _postCategoryService;
        public PostCategoryController(IErrorService errorService,IPostCategoryService postCategoryService) : base(errorService)
        {
            this._postCategoryService = postCategoryService;
        }
        [Route("getall")]
        [HttpGet]

        public HttpResponseMessage Get(HttpRequestMessage request, string keyword, int page, int pageSize = 20)
        {
            return CreateHttpResponse(request, () =>
            {
                int totalRow = 0;
                var model = _postCategoryService.GetAll(keyword);
                totalRow = model.Count();
                var query = model.OrderByDescending(x => x.CreatedDate).Skip(page * pageSize).Take(pageSize);

                //Mapping listCategory vào danh sách PostCategoryViewModel
                var responseData = Mapper.Map< IEnumerable <PostCategory>,IEnumerable <PostCategoryViewModel>>(query);

                var paginationSet = new PaginationSet<PostCategoryViewModel>()
                {
                    Items = responseData,
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize)
                };
                var response = request.CreateResponse(HttpStatusCode.OK, paginationSet);

                return response;
            });
        }
        [Route("create")]
        [HttpPost]
        [AllowAnonymous]
        public HttpResponseMessage Post(HttpRequestMessage request, PostCategoryViewModel postCategoryVm)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var newPostCategory = new PostCategory();
                    //newPostCategory.CreatedDate = DateTime.Now;
                    newPostCategory.UpdatePostCategory(postCategoryVm);
                    newPostCategory.CreatedBy = User.Identity.Name;
                    newPostCategory.CreatedDate = DateTime.Now;
                    _postCategoryService.Add(newPostCategory);
                    _postCategoryService.Save();

                    var responseData = Mapper.Map<PostCategory, PostCategoryViewModel>(newPostCategory);
                    
                    response = request.CreateResponse(HttpStatusCode.Created, responseData);

                }
                
                return response;
            });
        }

        [Route("update")]
        [HttpPut]
        [AllowAnonymous]
        public HttpResponseMessage Put(HttpRequestMessage request, PostCategoryViewModel postCategoryVm)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    //get post category từ db ra theo post category view model truyển vào
                    var postCategoryDb = _postCategoryService.GetById(postCategoryVm.ID);
                    //postCategoryDb.UpdatedDate = DateTime.Now;
                    //update post category được get ở trên vào object postCategoryDb
                    postCategoryDb.UpdatedBy = User.Identity.Name;
                    postCategoryDb.CreatedDate = DateTime.Now;
                    postCategoryDb.UpdatePostCategory(postCategoryVm);

                    //update vào db = service
                    _postCategoryService.Update(postCategoryDb);
                    _postCategoryService.Save();

                    var responseData = Mapper.Map<PostCategory, PostCategoryViewModel>(postCategoryDb);
                    response = request.CreateResponse(HttpStatusCode.Created);

                }
                return response;
            });
        }
        [Route("delete")]
        [HttpDelete]
        [AllowAnonymous]
        public HttpResponseMessage Delete(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var oldPostCategory = _postCategoryService.Delete(id);
                    _postCategoryService.Save();

                    var responseData = Mapper.Map<PostCategory, PostCategoryViewModel>(oldPostCategory);
                    response = request.CreateResponse(HttpStatusCode.Created,responseData);

                }
                return response;
            });
        }
        [Route("deletemulti")]
        [HttpDelete]
        [AllowAnonymous]
        public HttpResponseMessage DeleteMulti(HttpRequestMessage request, string checkedPostCategories)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var listPostCategory = new JavaScriptSerializer().Deserialize<List<int>>(checkedPostCategories);
                    foreach (var item in listPostCategory)
                    {
                        _postCategoryService.Delete(item);
                    }
                    _postCategoryService.Save();
                    response = request.CreateResponse(HttpStatusCode.OK, listPostCategory.Count);
                }
                return response;
            });
        }
        [Route("getallparents")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
             {
                 var model = _postCategoryService.GetAll();
                 var responseData = Mapper.Map<IEnumerable<PostCategory>, IEnumerable<PostCategoryViewModel>>(model);
                 var response = request.CreateResponse(HttpStatusCode.OK, responseData);
                 return response;
             });
        }
        [Route("getbyid/{id:int}")]
        [HttpGet]
        public HttpResponseMessage GetById(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
             {
                 var model = _postCategoryService.GetById(id);
                 var responseData = Mapper.Map<PostCategory, PostCategoryViewModel>(model);
                 var response = request.CreateResponse(HttpStatusCode.OK, responseData);
                 return response;
             });
        }
    }
}