using System;
using System.Configuration;


namespace SimpleExpenditureTracker.Config
{
    public class GetDatabaseConfig
    {
        private static string database_server;
        private static string database_uid;
        private static string database_password;
        private static string database_name;

        private static readonly object padlock = new object();

        public static GetDatabaseConfig instance;

        private GetDatabaseConfig()
        {
        }

        ~GetDatabaseConfig()
        {
            instance = null;
        }

        public static GetDatabaseConfig Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new GetDatabaseConfig();
                        instance.getDatabaseConfig();
                    }

                    return instance;
                }

            }
        }

        //Get Database Config from file
        public void getDatabaseConfig()
        {
            Console.WriteLine("Loading App Config from 'app.config'");
            database_server = ConfigurationManager.AppSettings["database_server"];
            database_uid = ConfigurationManager.AppSettings["database_uid"];
            database_password = ConfigurationManager.AppSettings["database_password"];
            database_name = ConfigurationManager.AppSettings["database_name"];
            Console.WriteLine("Loaded App Config from 'app.config'");
        }

        public string getDatabaseName()
        {
            return database_name;
        }

        public string getDatabaseServer()
        {
            return database_server;
        }

        public string getDatabaseUid()
        {
            return database_uid;
        }
        public string getDatabasePassword()
        {
            return database_password;
        }
    }
}
