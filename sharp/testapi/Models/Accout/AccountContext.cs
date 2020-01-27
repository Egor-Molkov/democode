using System;
using Microsoft.EntityFrameworkCore;

namespace testapi.models
{
    public partial class AppApiContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }
 
    }
}
