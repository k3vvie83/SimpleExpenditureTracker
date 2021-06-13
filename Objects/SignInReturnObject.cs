using System;

namespace SimpleExpenditureTracker.Objects
{
    public class SignInReturnObject
    {
        public string UserUUID { get; set; }

        public string UserFullName { get; set; }

        public string UserLoginID { get; set; }

        public string Role { get; set; }
    }
}
