using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Microsoft.EntityFrameworkCore;

using Microsoft.IdentityModel.Tokens;

using testapi.models;

namespace testapi
{
    public class Startup
    {
        public Startup( IConfiguration configuration )
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices( IServiceCollection services )
        {
            // Сервис доступа, используем jwt токины
            services.AddAuthentication( JwtBearerDefaults.AuthenticationScheme )
                    .AddJwtBearer( options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            // укзывает, будет ли валидироваться издатель при валидации токена
                            ValidateIssuer = true,
                            // строка, представляющая издателя
                            ValidIssuer = AuthJWT.ISSUER,
                            // будет ли валидироваться потребитель токена
                            ValidateAudience = true,
                            // установка потребителя токена
                            ValidAudience = AuthJWT.AUDIENCE,
                            // будет ли валидироваться время существования
                            ValidateLifetime = false,
                            // установка ключа безопасности
                            IssuerSigningKey = AuthJWT.GetSymmetricSecurityKey(),
                            // валидация ключа безопасности
                            ValidateIssuerSigningKey = true,
                        };
                    });
            // Сжатие данных в том числе HTTPS
            services.AddResponseCompression( options => options.EnableForHttps = true );
            // Подключение к БД
            string connection = Configuration.GetConnectionString( "DefaultConnection" );
            // добавляем контексты моделей в качестве сервиса в приложение
            services.AddDbContext<AppApiContext> ( options => options.UseMySql( connection ) );
            // подключаем котроллеры
            services.AddControllers();
            // Политика CORS
            services.AddCors(options =>
            {
                options.AddPolicy("Origin", builder => builder
                    .WithOrigins("http://test.loc") // для этого домена
                    .AllowAnyHeader() // все заголовки
                    .AllowAnyMethod() // и методы
               );
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure( IApplicationBuilder app, IWebHostEnvironment env )
        {
            // Для деволопер версии отладачная страница
            if ( env.IsDevelopment() )
            {
                app.UseDeveloperExceptionPage();
            }
            // редиректы разрешены
            app.UseHttpsRedirection();
            // роутенг
            app.UseRouting();
            // заголовок для CORS
            app.UseCors("Origin");
            // палитика доступа
            app.UseAuthentication();
            app.UseAuthorization();
            // сжатие
            app.UseResponseCompression();
            // конечные точки по контраллерам
            app.UseEndpoints( endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
