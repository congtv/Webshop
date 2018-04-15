using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.DataProtection;
using Owin;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using WebShop.Data;
using WebShop.Data.Infrastructure;
using WebShop.Data.Repositories;
using WebShop.Model.Models;
using WebShop.Service;

//Cài đặt package Microsoft.Owin.Host.SystemWeb để set quền startup cho Startup.cs
//Chạy sau khi chạy xong Global.asax
[assembly: OwinStartup(typeof(WebShop.Web.App_Start.Startup))]

namespace WebShop.Web.App_Start
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            ConfigAutofac(app);
            ConfigureAuth(app);
        }

        private void ConfigAutofac(IAppBuilder app)
        {
            //Khởi tạo đối tuọng builber kiểu ContainerBuilder nằm trong AutoFac
            var builder = new ContainerBuilder();

            //Register các đối tượng Controller để đăng ký type
            builder.RegisterControllers(Assembly.GetExecutingAssembly());

            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            //Đăng ký mỗi khi có class gọi đến IUnitOfWork, mỗi request sẽ instance tạo ra đối tượng UnitOfWork
            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>().InstancePerRequest();
            builder.RegisterType<DbFactory>().As<IDbFactory>().InstancePerRequest();

            //Đăng kí DBContext, tương tự trên
            builder.RegisterType<WebShopDbContext>().AsSelf().InstancePerRequest();

            //Asp.net Identity
            builder.RegisterType<ApplicationUserStore>().As<IUserStore<ApplicationUser>>().InstancePerRequest();
            builder.RegisterType<ApplicationUserManager>().AsSelf().InstancePerRequest();
            builder.RegisterType<ApplicationSignInManager>().AsSelf().InstancePerRequest();
            builder.Register(c => HttpContext.Current.GetOwinContext().Authentication).InstancePerRequest();
            builder.Register(c => app.GetDataProtectionProvider()).InstancePerRequest();

            // Repositories
            //builder sẽ lấy ra tất cả các type cùng kiểu PostCategoryRepository với hậu tố là Repository sẽ lấy ImplementedInterfaces của Repository sau đó instance lên
            builder.RegisterAssemblyTypes(typeof(PostCategoryRepository).Assembly)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces().InstancePerRequest();

            // Services
            //Tương tự Repositories
            builder.RegisterAssemblyTypes(typeof(PostCategoryService).Assembly)
               .Where(t => t.Name.EndsWith("Service"))
               .AsImplementedInterfaces().InstancePerRequest();

            //Sau khi register hết các thành phần, gán builder vào container
            Autofac.IContainer container = builder.Build();

            //Thay thế cơ chế mặc định = Resolver vừa register
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            //Set the WebApi DependencyResolver
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver((IContainer)container);
        }
    }
}