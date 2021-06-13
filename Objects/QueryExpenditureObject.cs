using System;

namespace A_Simple_Web_App.Objects
{
    public class QueryExpenditureObject
    {
        public string ExpensesUUID { get; set; }

        public string UserUUID { get; set; }

        public DateTime DateOfExpenditure { get; set; }

        public string Description { get; set; }

        public float AmountSpent { get; set; }

        public string Remarks { get; set; }
    }
}
