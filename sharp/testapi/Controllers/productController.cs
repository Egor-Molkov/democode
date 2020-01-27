using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

//using Microsoft.Extensions.Logging;

using Microsoft.EntityFrameworkCore;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using testapi.models;

namespace testapi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1.0/[controller]")]
    [Produces("application/json")]
    [TimeExecute]
    public class ProductController : ControllerBase
    {
        //private readonly ILogger<ProductController> _logger;
        private AppApiContext db;

        public ProductController( /*ILogger<ProductController> logger,*/ AppApiContext context )
        {
            //_logger = logger;
            db = context;
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Route("list")]
        public async Task<IActionResult> List( int? id )
        {
            if( id != null )
            {
                return Ok( await db.Products.Where( p => p.Id == id ).ToListAsync() );
            }
            return Ok( await db.Products.ToListAsync() );
        }

///////////////////////////////////////////////////////////////////////////////////
       
        [Route("company/list")]
        public async Task<IActionResult> CompanyList( int? id )
        {
            if( id != null )
            {
                var productsCompanyId = db.Products.Where( p => p.Id == id )
                    .Join( db.Companys, 
                    p => p.CompanyId, 
                    c => c.Id, 
                    (p, c) => new 
                    {
                        Id = p.Id,
                        Name = p.Name, 
                        Company = c.Name
                    });

                return Ok( await productsCompanyId.ToListAsync() );                
            }
            
            var productsCompany = db.Products.Join( db.Companys, // второй набор
                p => p.CompanyId, // свойство-селектор объекта из первого набора
                c => c.Id, // свойство-селектор объекта из второго набора
                (p, c) => new // результат
                {
                    Id = p.Id,
                    Name = p.Name, 
                    Company = c.Name
                });

            return Ok( await productsCompany.ToListAsync() );
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Authorize(Roles = "admin")]
        [Route("create")]
        public async Task<IActionResult> Create( [FromBody] Product product )
        {
            if ( ModelState.IsValid )
    	    {
            	db.Products.Add( product );

            	await db.SaveChangesAsync();
            
            	return Ok( product );
    	    }
            return BadRequest( ModelState );
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Authorize(Roles = "admin")]
        [Route("update")]
        public async Task<IActionResult> Update( [FromBody] Product product )
        {   
            if ( ModelState.IsValid )
            {
                var isProductId = db.Products.AsNoTracking().FirstOrDefault( p => p.Id == product.Id );
                if ( isProductId != null )
                {
                    db.Products.Update( product );

                    await db.SaveChangesAsync();

                    return Ok( product );
                }
                return BadRequest( new { errorText = $"Продукт ид - { product.Id } не найден" } );
            }
            return BadRequest( ModelState );
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Authorize(Roles = "admin")]
        [Route("delete")]
        public async Task<IActionResult> Delete( [FromBody] Product product )
        {   
            var isProductId = db.Products.AsNoTracking().FirstOrDefault( p => p.Id == product.Id );
            if ( isProductId != null )
            {
                db.Products.Remove( product );

                await db.SaveChangesAsync();

                return Ok( product );
            }
            return BadRequest( new { errorText = $"Продукт ид - { product.Id } не найден" } );
        }
        
    }

}
