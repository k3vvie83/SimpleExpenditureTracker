using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleExpenditureTracker.Objects
{
    public class CreateUpdateUserObject
    {
        public string UserUUID { get; set; }

        public string UserFullName { get; set; }

        public string UserLoginID { get; set; }

        public string HashedPassword { get; set; }

        public string Role { get; set; }

    }
}
