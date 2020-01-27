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
    public class CompanyController : ControllerBase
    {
        //private readonly ILogger<CompanyController> _logger;
        private AppApiContext db;

        public CompanyController( /*ILogger<CompanyController> logger,*/ AppApiContext context )
        {
            //_logger = logger;
            db = context;
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Route("list")]
        public async Task<IActionResult> List( int? id )
        {
            if ( id != null ) 
            {
                return Ok( await db.Companys.Where( c => c.Id == id ).ToListAsync() );
            } 
            return Ok( await db.Companys.ToListAsync() );
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Route("product/list")]
        public async Task<IActionResult> ProductList( int? id )
        {
            if ( id != null ) 
            {
                return Ok( await db.Companys.Include( p => p.Products )
                    .Where( c => c.Id == id ).ToListAsync() );
            } 
            return Ok( await db.Companys.Include( p => p.Products ).ToListAsync() );
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Authorize(Roles = "admin")]
        [Route("create")]
        public async Task<IActionResult> Create( [FromBody] Company company )
        {
            if ( ModelState.IsValid )
    	       {
            	db.Companys.Add( company );

            	await db.SaveChangesAsync();
            
            	return Ok( company );
            }
            return BadRequest( ModelState );
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Authorize(Roles = "admin")]
        [Route("update")]
        public async Task<IActionResult> Update( [FromBody] Company company )
        {   
            if ( ModelState.IsValid )
            {
                var isCompanyId = db.Companys.AsNoTracking().FirstOrDefault( c => c.Id == company.Id );
                
                if ( isCompanyId != null )
                {
				db.Companys.Update( company );

                    await db.SaveChangesAsync();

                    return Ok( company );
                }
                return BadRequest( new { errorText = $"Компания ид - { company.Id } не найдена" } );
            }
            return BadRequest( ModelState );
        }

///////////////////////////////////////////////////////////////////////////////////
        
        [Authorize(Roles = "admin")]
        [Route("delete")]
        public async Task<IActionResult> Delete( [FromBody] Company company )
        {   
            var isCompanyId = db.Companys.AsNoTracking().FirstOrDefault( c => c.Id == company.Id );

            if ( isCompanyId != null )
            {
                db.Companys.Remove( company );

                await db.SaveChangesAsync();

                return Ok( company );
            }
            return BadRequest( new { errorText = $"Компания ид - { company.Id } не найдена" } );
        }

    }

}
