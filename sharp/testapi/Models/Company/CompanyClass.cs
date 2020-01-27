using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace testapi.models
{
   public class Company // Тестовая сущность
   {
      public int Id { get; set; }

      [Required ( ErrorMessage = "Не указано имя компании" )]
      [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина строки должна быть от 3 до 50 символов")]
      public string Name { get; set; }

      public List<Product> Products { get; set; }

      public Company()
      {
         Products = new List<Product>();
      }

   }
}
