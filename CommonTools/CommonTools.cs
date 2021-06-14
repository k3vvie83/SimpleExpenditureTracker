using System;
using System.Text.Json;

namespace SimpleExpenditureTracker.CommonTools
{
    public sealed class CommonTools
    {
        private static CommonTools instance;
        private static readonly object padlock = new object();

        private CommonTools()
        {
        }

        ~CommonTools()
        {
            instance = null;
        }

        public static CommonTools Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new CommonTools();
                    }

                    return instance;
                }
            }
        }

        //Common Utility to Seralise List<Objects> to JSON String 
        public string ConvertObjectToJSONString(object obj)
        {
            try
            {
                return JsonSerializer.Serialize(obj);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return null;
        }
    }
}
