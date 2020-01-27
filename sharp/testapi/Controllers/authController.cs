using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

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
    public class AuthController : Controller
    {
        //private readonly ILogger<AuthController> auth_logger;
        private AppApiContext db;

        public AuthController( /*ILogger<AuthController> logger,*/ AppApiContext context )
        {
            //auth_logger = logger;
            db = context;
        }
 
 ///////////////////////////////////////////////////////////////////////////////////

        [AllowAnonymous]
        [Route("login")]
        public IActionResult Login( [FromBody] AccountProxy user )
        {
            string user_ip = HttpContext.Connection.RemoteIpAddress.ToString();
            
            if ( ModelState.IsValid )
    	       {
                var identity = GetIdentity( user.Login, user.Password, user_ip );

                if ( identity == null )
                {
                    return BadRequest( new { errorText = "Неверный логин или пароль." } );
                }
 
                var now = DateTime.UtcNow;
                // создаем JWT-токен
                var jwt = new JwtSecurityToken(
                        issuer: AuthJWT.ISSUER,
                        audience: AuthJWT.AUDIENCE,
                        notBefore: now,
                        claims: identity.Claims,
                        expires: now.Add( TimeSpan.FromMinutes( AuthJWT.LIFETIME )),
                        signingCredentials: new SigningCredentials( AuthJWT.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256 ));
                
                var encodedJwt = new JwtSecurityTokenHandler().WriteToken( jwt );
    
                var response = new
                {
                    access_token = encodedJwt,
                    role = identity.FindFirst("role").Value
                };

                return Ok( response );
            }
            return BadRequest( ModelState );
        }

///////////////////////////////////////////////////////////////////////////////////

        [Route("test")]
        public  IActionResult Test()
        {
            return Ok( "Пользователь авторизован!" );
        }

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

        private ClaimsIdentity GetIdentity( string login, string password, string ip )
        {
            Account self_account = db.Accounts.FirstOrDefault( x => x.Login == login && x.Password == password );
            
            if ( self_account != null )
            {
                var claims = new List<Claim>
                {
                    new Claim( ClaimsIdentity.DefaultNameClaimType, self_account.Login ),
                    new Claim( ClaimsIdentity.DefaultRoleClaimType, self_account.Role ),
                    new Claim( "role", self_account.Role ),
                    new Claim( "ip", ip )
                };

                ClaimsIdentity claimsIdentity =
                new ClaimsIdentity( claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType );
                
                return claimsIdentity;
            }
 
            // если пользователя не найдено
            return null;
        }

    }
    
}
