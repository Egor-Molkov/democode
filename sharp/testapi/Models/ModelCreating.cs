using System;
using Microsoft.EntityFrameworkCore;

namespace testapi.models
{
    public partial class AppApiContext : DbContext
    {
        public AppApiContext( DbContextOptions<AppApiContext> options )
            : base( options )
        {
            //Database.EnsureDeleted();
           // Database.EnsureCreated();   // создаем базу данных при первом обращении
        }
        // Начальные данные
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>().HasData(
                new Account[] 
                {
                    new Account { Id = 1, Login = "admin@ya.ru", Password = "12345", PasswordConfirm = "12345", Role = "admin", Profile = {} },
                    new Account { Id = 2, Login = "test@ya.ru", Password = "55555", PasswordConfirm = "55555", Role = "user", Profile = {} }
                });

            modelBuilder.Entity<Company>().HasData(
                new Company[] 
                {
                    new Company { Id = 1, Name = "Company 1" },
                    new Company { Id = 2, Name = "Company 2" }
                });
                
            modelBuilder.Entity<Product>().HasData(
                new Product[] 
                {
                    new Product { Id = 1, Name = "Product 1", CompanyId = 1 },
                    new Product { Id = 2, Name = "Product 2", CompanyId = 2 },
                    new Product { Id = 3, Name = "Product 3", CompanyId = 1 },
                    new Product { Id = 4, Name = "Product 4", CompanyId = 2 }
                });

        }
    }
}