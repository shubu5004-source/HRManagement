using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Department
{
    public int Id { get; set; }

    public string DepartmentName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
