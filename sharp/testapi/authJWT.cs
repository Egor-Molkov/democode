using Microsoft.IdentityModel.Tokens;
using System.Text;
 
namespace testapi
{
    public class AuthJWT
    {
        public const string ISSUER = "TestApiServer"; // издатель токена
        public const string AUDIENCE = "TestApiClient"; // потребитель токена
        const string KEY = "mysupersecret_secretkey!777"; // ключ для шифрации
        public const int LIFETIME = 1 * 60 ; // время жизни токена - 1 час
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey( Encoding.ASCII.GetBytes( KEY ) );
        }
    }
}