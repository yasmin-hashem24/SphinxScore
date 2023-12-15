using EdgeDB;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;

namespace SphinxScore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddEdgeDB(EdgeDBConnection.FromInstanceName("SphinxScore"), config =>
            {
                config.SchemaNamingStrategy = INamingStrategy.SnakeCaseNamingStrategy;
            });

           

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");

                endpoints.MapControllers();
                endpoints.MapGet("/user", async context =>
                {
                    try
                    {
                        var edgeDbClient = context.RequestServices.GetRequiredService<EdgeDBClient>();

                        var query = "SELECT user { id, username, first_name, last_name, birth_date, gender, city, address, email_address, role }";
                        var users = await edgeDbClient.QueryAsync<User>(query);


                        await context.Response.WriteAsJsonAsync(users);
                    }
                    catch (Exception ex)
                    {
                        context.Response.StatusCode = 500;
                        await context.Response.WriteAsync($"Error: {ex.Message}");
                    }
                });

            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            
        }
    }
}
