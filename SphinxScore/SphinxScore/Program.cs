using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EdgeDB;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;

namespace SphinxScore
{

    public class Program
    {

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddEdgeDB(EdgeDBConnection.FromInstanceName("SphinxScore"), config =>
            {
                config.SchemaNamingStrategy = INamingStrategy.SnakeCaseNamingStrategy;
            });
            builder.Logging.AddConsole();
            CreateHostBuilder(args).Build().Run();

            using var app = builder.Build();

           

        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

       
    }

   
}
