using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
 
namespace testapi
{
    // Фильтр действия, время выполнения акшена, после привязки модели
    public class TimeExecuteAttribute : Attribute, IActionFilter
    {
        DateTime start;
        public void OnActionExecuting( ActionExecutingContext context )
        {
            start = DateTime.Now;
        }
        public void OnActionExecuted( ActionExecutedContext context )
        {
            DateTime end = DateTime.Now;

            double processTime = Math.Round( end.Subtract( start ).TotalMilliseconds ) / 1000;
            
            context.HttpContext.Response.Headers.Add( "Execution-time", processTime.ToString() + " s." );
        }
    }
}