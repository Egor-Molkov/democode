using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace testapi.models
{
   public class Account // Служба авторизации
   {
      public int Id { get; set; }

      [Required ( ErrorMessage = "Не указан email" )]
      [EmailAddress ( ErrorMessage = "Не верный email" )]
      [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина email должна быть от 3 до 50 символов")]
      public string Login { get; set; }

      [Required ( ErrorMessage = "Не указан пароль" )]
      [StringLength(50, MinimumLength = 5, ErrorMessage = "Длина пароля должна быть от 5 до 50 символов")]
      public string Password { get; set; }

      [NotMapped]
      [Compare("Password", ErrorMessage = "Пароли не совпадают")]
      public string PasswordConfirm { get; set; }

      [Required ( ErrorMessage = "Не указана роль" )]
      [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина роли должна быть от 3 до 50 символов")]
      public string Role { get; set; }
      
      public AccountProfile Profile { get; set; }
   }
   
   [Owned]
   public class AccountProfile // Профиль
   {
      [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина имени должна быть от 3 до 50 символов")]
      public string FirstName { get; set; }

      [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина имени должна быть от 3 до 50 символов")]
      public string LastName { get; set; }

      [Range(0, 120, ErrorMessage = "Недопустимый возраст")]
      public int Age { get; set; }

      public string Foto { get; set; }

   }

   public class AccountProxy
   {
      [Required ( ErrorMessage = "Не указан email" )]
      [EmailAddress ( ErrorMessage = "Не верный email" )]
      [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина email должна быть от 3 до 50 символов")]
      public string Login { get; set; }

      [Required ( ErrorMessage = "Не указан пароль" )]
      [StringLength(50, MinimumLength = 5, ErrorMessage = "Длина пароля должна быть от 5 до 50 символов")]
      public string Password { get; set; }

      public string PasswordConfirm { get; set; }
   }
}
