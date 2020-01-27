using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace testapi.models
{
   public class Product // Тестовая сущность
   {
      public int Id { get; set; }

      [Required ( ErrorMessage = "Не указано имя продукта" )]
      [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина строки должна быть от 3 до 50 символов")]
      public string Name { get; set; }

      [Required ( ErrorMessage = "Не указано ид компании" )]
      public int CompanyId { get; set; }
      [JsonIgnore]
      public Company Company { get; set; }
   }
}
