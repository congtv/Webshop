using AutoMapper;
using WebShop.Model.Models;
using WebShop.Web.Models;

namespace WebShop.Web.Mapping
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {
            //B1: Tạo mapper config
            Mapper.Initialize(config =>
                {
                    //map from <Source, Destination> = <PostCategory,PostCategoryViewModel>
                    config.CreateMap<PostCategory, PostCategoryViewModel>();
                    config.CreateMap<Post, PostViewModel>();
                    config.CreateMap<Tag, TagViewModel>();

                    config.CreateMap<ProductTag, ProductTagViewModel>();
                    config.CreateMap<Product, ProductViewModel>();
                    config.CreateMap<ProductCategory, ProductCategoryViewModel>();
                });
            //B2: muốn mapping đối tượng ta làm như sau : 
            //var post_category = new PostCategory { ID = 999, Name = "Test" };
            //var postCategory = mapper.Map<PostCategory, PostCategoryViewModel>(post_category);
        }
    }
}