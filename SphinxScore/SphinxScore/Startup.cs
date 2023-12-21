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
using MongoDB.Driver;
using Microsoft.Extensions.Logging;

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

            services.AddLogging(builder =>
            {
                builder.AddConsole();
            });
            services.AddSingleton<IMongoClient>(sp =>
            {
                var connectionString = "mongodb+srv://yasminhashem201:rxahCtHfpBUPxO3b@cluster0.hlauz1s.mongodb.net/?retryWrites=true&w=majority";
     
                return new MongoClient(connectionString);
            });

            services.AddScoped<IMongoCollection<User>>(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                var databaseName = "SphinxScoreDB";
                var collection = client.GetDatabase(databaseName).GetCollection<User>("user");

                var collectionNames = client.GetDatabase(databaseName).ListCollectionNames().ToList();

                return collection;
            });

            services.AddScoped<IMongoCollection<Match>>(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                var databaseName = "SphinxScoreDB";
                var collection = client.GetDatabase(databaseName).GetCollection<Match>("match");

                var collectionNames = client.GetDatabase(databaseName).ListCollectionNames().ToList();

                return collection;
            });


            // In production, the React files will be served from this directory



            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
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

            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
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
