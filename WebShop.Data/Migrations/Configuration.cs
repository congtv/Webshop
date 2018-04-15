namespace WebShop.Data.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Model.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<WebShop.Data.WebShopDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(WebShopDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.
            CreateProductCategorySample(context);

            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new WebShopDbContext()));

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new WebShopDbContext()));

            var user = new ApplicationUser()
            {
                UserName = "admin",
                Email = "mr.wlight@gmail.com",
                EmailConfirmed = true,
                BirthDay = DateTime.Now,
                FullName = "Sương Gió Hà Nội"
            };

            manager.Create(user, "123456$");

            if (!roleManager.Roles.Any())
            {
                roleManager.Create(new IdentityRole { Name = "Admin" });
                roleManager.Create(new IdentityRole { Name = "User" });
            }

            var adminUser = manager.FindByEmail("mr.wlight@gmail.com");

            manager.AddToRoles(adminUser.Id, new string[] { "Admin", "User" });
        }

        private void CreateProductCategorySample(WebShopDbContext context)
        {
            if (context.ProductCategories.Count() == 0)
            {
                List<ProductCategory> listProductCategory = new List<ProductCategory>()
                {
                    new ProductCategory() { Name = "Điện lạnh" ,Alias = "dien-lanh",Status = true },
                    new ProductCategory() { Name = "Viễn thông" ,Alias = "vien-thong",Status = true },
                    new ProductCategory() { Name = "Đồ gia dụng" ,Alias = "do-gia-dung",Status = true },
                    new ProductCategory() { Name = "Mỹ phẩm" ,Alias = "my-pham",Status = true },
                };
                context.ProductCategories.AddRange(listProductCategory);
                context.SaveChanges();
            }
        }
    }
}