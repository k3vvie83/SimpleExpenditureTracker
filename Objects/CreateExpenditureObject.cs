using System;

namespace SimpleExpenditureTracker.Objects
{
    public class CreateExpenditureObject
    {
        //public string ExpensesUUID { get; set; }

        public string UserUUID { get; set; }

        public DateTime DateOfExpenditure { get; set; }

        public string Description { get; set; }

        public float AmountSpent { get; set; }

        public string Remarks { get; set; }
    }
}
