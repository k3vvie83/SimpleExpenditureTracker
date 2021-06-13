using System;

namespace SimpleExpenditureTracker.Objects
{
    public class ChangePasswordObject
    {
        public string UserUUID { get; set; }

        public string HashedOldPassword { get; set; }
        
        public string HashedNewPassword { get; set; }
    }
}
