using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A_Simple_Web_App.Objects
{
    public class ChangePasswordObject
    {
        public string UserUUID { get; set; }

        public string HashedOldPassword { get; set; }
        
        public string HashedNewPassword { get; set; }
    }
}
