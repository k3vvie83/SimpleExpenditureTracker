using System.Text.Json;

namespace A_Simple_Web_App.CommonTools
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

        public string ConvertObjectToJSONString(object obj)
        {
            try
            {
                return JsonSerializer.Serialize(obj);
            }
            catch
            {

            }
            return null;
        }
    }

}
