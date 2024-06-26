﻿using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using SimpleExpenditureTracker.Objects;
using SimpleExpenditureTracker.Config;

namespace SimpleExpenditureTracker.Database
{
    public sealed class DatabaseConnector
    {
        //Enum
        public enum DBReturnResult : int
        {
            None = 0,
            SUCCESS = 1,
            NOT_SUCCESS = 2
        }

        private static DatabaseConnector instance;
        private static MySqlCommand cmd;
        private static MySqlConnection conn;

        private static readonly object padlock = new object();

        private DatabaseConnector()
        {

        }

        ~DatabaseConnector()
        {
            instance = null;
        }

        public static DatabaseConnector Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new DatabaseConnector();
                        instance.ConnectToDataBase();
                    }

                    return instance;
                }

            }
        }

        //Connect to Database
        public void ConnectToDataBase()
        {

            string myConnectionString = null;

            //myConnectionString = "server=mysql;uid=appdbuser;pwd=P@ssw0rd;database=SimpleDatabase";
            string server = "server=" + GetDatabaseConfig.Instance.getDatabaseServer() + ";";
            string uid = "uid=" + GetDatabaseConfig.Instance.getDatabaseUid() + ";";
            string password = "password=" + GetDatabaseConfig.Instance.getDatabasePassword() + ";";
            string database = "database=" + GetDatabaseConfig.Instance.getDatabaseName();

            myConnectionString = server + uid + password + database;

            Console.WriteLine("myConnectionString  = " + myConnectionString);


            try
            {
                conn = new MySqlConnection();
                conn.ConnectionString = myConnectionString;

                Console.WriteLine("Conecting to MySQL..");
                conn.Open();

                cmd = new MySqlCommand();
                cmd.Connection = conn;

                Console.WriteLine("Connected to MySQL..");

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return;
        }

        //Query User Password Function Call
        public DBReturnResult QueryUserPassword(string UserLoginID, ref string userPassword)
        {
            MySqlDataReader myPwdReader = null;

            try
            {
                cmd.CommandText = "Select Password from SimpleDatabase.UserTable where UserLoginID = " + "'".ToUpper() + UserLoginID + "'";
                cmd.Prepare();


                myPwdReader = cmd.ExecuteReader();


                while (myPwdReader.Read())
                {
                    if (!myPwdReader.IsDBNull(0))
                        userPassword = (myPwdReader.GetString(0));
                }


                myPwdReader.Close();


            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myPwdReader.Close();
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Query User Role Function Call
        public DBReturnResult QueryUserRole(string UserUUID, ref string Role)
        {
            MySqlDataReader myPwdReader = null;

            try
            {
                cmd.CommandText = "Select Role from SimpleDatabase.UserTable where UserUUID = " + "'" + UserUUID + "'";
                cmd.Prepare();


                myPwdReader = cmd.ExecuteReader();


                while (myPwdReader.Read())
                {
                    if (!myPwdReader.IsDBNull(0))
                        Role = (myPwdReader.GetString(0));
                }


                myPwdReader.Close();


            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myPwdReader.Close();
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Query User UUID Function Call
        public DBReturnResult QueryUserUUID(string UserLoginID, ref string UserUUID)
        {
            MySqlDataReader myQueryUserReader = null;

            try
            {
                cmd.CommandText = "Select UserUUID from SimpleDatabase.UserTable where UserLoginID = " + "'" + UserLoginID.ToUpper() + "'";
                cmd.Prepare();

                myQueryUserReader = cmd.ExecuteReader();


                while (myQueryUserReader.Read())
                {
                    if (!myQueryUserReader.IsDBNull(0))
                        UserUUID = (myQueryUserReader.GetString(0));
                }


                myQueryUserReader.Close();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myQueryUserReader.Close();
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Query User Name Function Call
        public DBReturnResult QueryUserName(string UserUUID, ref string UserFullName)
        {
            MySqlDataReader myQueryNameReader = null;

            try
            {
                cmd.CommandText = "Select UserFullName from SimpleDatabase.UserTable where UserUUID = " + "'" + UserUUID + "'";
                cmd.Prepare();

                myQueryNameReader = cmd.ExecuteReader();

                while (myQueryNameReader.Read())
                {
                    if (!myQueryNameReader.IsDBNull(0))
                        UserFullName = (myQueryNameReader.GetString(0));
                }

                myQueryNameReader.Close();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myQueryNameReader.Close();

                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Query All User Function Call
        public DBReturnResult QueryAllUser(ref List<SignInReturnObject> ListOfReturnObjs)
        {
            MySqlDataReader myQueryNameReader = null;

            try
            {
                cmd.CommandText = "Select `UserUUID`, `UserFullName`, `UserLoginID`, `Role` from SimpleDatabase.UserTable Order By UserFullName Asc;";
                cmd.Prepare();

                myQueryNameReader = cmd.ExecuteReader();

                while (myQueryNameReader.Read())
                {
                    if (!myQueryNameReader.IsDBNull(0))
                    {
                        SignInReturnObject ro = new SignInReturnObject();

                        ro.UserUUID = myQueryNameReader.GetString(0);
                        ro.UserFullName = myQueryNameReader.GetString(1);
                        ro.UserLoginID = myQueryNameReader.GetString(2);
                        ro.Role = myQueryNameReader.GetString(3);

                        ListOfReturnObjs.Add(ro);
                    }
                }

                myQueryNameReader.Close();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myQueryNameReader.Close();

                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //CHange User Password Function Call
        public DBReturnResult ChangeUserPassword(string UserUUID, string oldPassword, string newPassword, ref bool success)
        {
            string userPassword = null;
            MySqlDataReader myChangePwdReader = null;
            success = false;
            try
            {
                cmd.CommandText = "Select Password from SimpleDatabase.UserTable where UserUUID = " + "'" + UserUUID.ToUpper() + "'";
                cmd.Prepare();

                myChangePwdReader = cmd.ExecuteReader();

                if (myChangePwdReader != null)
                {
                    while (myChangePwdReader.Read())
                    {
                        if (!myChangePwdReader.IsDBNull(0))
                            userPassword = myChangePwdReader.GetString(0);
                    }

                    myChangePwdReader.Close();

                    if (userPassword.Equals(oldPassword))
                    {
                        cmd.CommandText = "Update SimpleDatabase.UserTable SET Password = '" + newPassword + "' WHERE UserUUID = '" + UserUUID + "'";
                        cmd.Prepare();

                        if (cmd.ExecuteNonQuery() == 1)
                            success = true;
                        else
                            success = false;
                    }
                    else
                    {
                        success = false;
                    }
                }

                // myChangePwdReader.Close();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myChangePwdReader.Close();
                success = false;

                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Update User Last Login Timestamp Function Call
        public DBReturnResult UpdateLastLoginTimestamp(string UserUUID)
        {
            try
            {
                cmd.CommandText = "Update SimpleDatabase.UserTable SET LastLogin = '" + DateTime.Now.ToString("yyyyMMddHHmmss") + "' WHERE UserUUID = '" + UserUUID + "'";
                cmd.Prepare();

                cmd.ExecuteNonQuery();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Create New Expenditure Record Function Call
        public DBReturnResult CreateNewExpenditureRecord(CreateExpenditureObject eo)
        {
            try
            {
                cmd.CommandText = "INSERT INTO `SimpleDatabase`.`Expenditure` " +
                    "(`ExpenditureUUID`, `UserUUID`, `DateOfExpenditure`, `Description`, `AmountSpent`, `Remarks`, `CreatedDT`, `LastUpdatedDT`) " +
                    "VALUES" +
                    "('" + Guid.NewGuid().ToString() + "', '" + eo.UserUUID + "', '" + eo.DateOfExpenditure.ToString("yyyyMMddHHmmss") + "', '" + eo.Description + "', '" + eo.AmountSpent + "', '" + eo.Remarks + "', '" + DateTime.Now.ToString("yyyyMMddHHmmss") + "',  '" + DateTime.Now.ToString("yyyyMMddHHmmss") + "');";

                cmd.Prepare();

                cmd.ExecuteNonQuery();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Add New User Function Call
        public DBReturnResult AddUser(CreateUpdateUserObject eo)
        {
            try
            {
                cmd.CommandText = "INSERT INTO `SimpleDatabase`.`UserTable` " +
                   "(`UserUUID`, `UserFullName`, `UserLoginID`, `Password`, `Role`, `LastLogin`, `CreatedDT`) " +
                   "VALUES" +
                   "('" + Guid.NewGuid().ToString() + "', '" + eo.UserFullName + "', '" + eo.UserLoginID.ToUpper() + "', '" + eo.HashedPassword + "', '" + eo.Role + "', '" + DateTime.Now.ToString("yyyyMMddHHmmss") + "', '" + DateTime.Now.ToString("yyyyMMddHHmmss") + "');";

                cmd.Prepare();

                cmd.ExecuteNonQuery();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Query Individual User's Expenditure Function Call
        public DBReturnResult QueryExpenditureRecord(string UserUUID, ref List<QueryExpenditureObject> listOfQEO)
        {

            //List<CreateExpenditureObject> listOfEO = new List<CreateExpenditureObject>();
            MySqlDataReader myQueryExpenditureListReader = null;

            try
            {
                cmd.CommandText = "SELECT `ExpenditureUUID`, `UserUUID`, `DateOfExpenditure`, `Description`, `AmountSpent`, `Remarks`   FROM SimpleDatabase.Expenditure WHERE UserUUID = '" + UserUUID + "' ORDER BY DateOfExpenditure DESC;";
                cmd.Prepare();

                myQueryExpenditureListReader = cmd.ExecuteReader();

                while (myQueryExpenditureListReader.Read())
                {
                    if (!myQueryExpenditureListReader.IsDBNull(0))
                    {
                        QueryExpenditureObject QEO = new QueryExpenditureObject();

                        QEO.ExpensesUUID = myQueryExpenditureListReader.GetString(0);
                        QEO.UserUUID = myQueryExpenditureListReader.GetString(1);
                        QEO.DateOfExpenditure = myQueryExpenditureListReader.GetDateTime(2);
                        QEO.Description = myQueryExpenditureListReader.GetString(3);
                        QEO.AmountSpent = myQueryExpenditureListReader.GetFloat(4);
                        QEO.Remarks = myQueryExpenditureListReader.GetString(5);

                        listOfQEO.Add(QEO);

                    }
                }


                myQueryExpenditureListReader.Close();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myQueryExpenditureListReader.Close();

                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Query Total Amount Spent by User Function Call
        public DBReturnResult QueryTotalExpenditureByUser(string UserUUID, ref float returnExpenditureAmount)
        {
            MySqlDataReader myQueryTotalExpenditureByUserReader = null;

            try
            {
                cmd.CommandText = "SELECT sum(AmountSpent) FROM SimpleDatabase.Expenditure WHERE UserUUID = '" + UserUUID.Trim() + "';";
                cmd.Prepare();

                myQueryTotalExpenditureByUserReader = cmd.ExecuteReader();


                while (myQueryTotalExpenditureByUserReader.Read())
                {
                    if (!myQueryTotalExpenditureByUserReader.IsDBNull(0))
                        returnExpenditureAmount = myQueryTotalExpenditureByUserReader.GetFloat(0);
                }



                myQueryTotalExpenditureByUserReader.Close();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                myQueryTotalExpenditureByUserReader.Close();
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }

        //Remove User Function Call
        public DBReturnResult DeleteUser(string UserUUID)
        {
            try
            {
                cmd.CommandText = "DELETE FROM `SimpleDatabase`.`UserTable` WHERE UserUUID = '" + UserUUID.Trim() + "';";
                Console.WriteLine(cmd.CommandText);
                cmd.Prepare();

                cmd.ExecuteNonQuery();
            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.ToString());
                return DBReturnResult.NOT_SUCCESS;
            }

            return DBReturnResult.SUCCESS;
        }
    }


    /*
     * Not Implemented Due to Time Constraints
     */

    //public DBReturnResult UpdateExpenditureRecord(CreateExpenditureObject eo)
    //{

    //    try
    //    {
    //        cmd.CommandText = "UPDATE `SimpleDatabase`.`Expenditure` SET `DateOfExpenditure` = '" + eo.DateOfExpenditure + " ', `Description` = '" + eo.Description + " ', `AmountSpent` = '" + eo.AmountSpent + " ', `Remarks` = '" + eo.Remarks + " ' WHERE(`UUID` = '" + eo.ExpensesUUID + " ');";

    //        cmd.Prepare();

    //        cmd.ExecuteNonQuery();

    //    }
    //    catch (MySql.Data.MySqlClient.MySqlException ex)
    //    {
    //        Console.WriteLine(ex.ToString());
    //        return DBReturnResult.NOT_SUCCESS;
    //    }

    //    return DBReturnResult.SUCCESS;
    //}

    //public DBReturnResult DeleteExpenditureRecord(string uuidOfExpenseRecord)
    //{
    //    try
    //    {
    //        cmd.CommandText = "DELETE FROM `SimpleDatabase`.`Expenditure` WHERE(`ExpenditureUUID` = '" + uuidOfExpenseRecord + "');";
    //        cmd.Prepare();

    //        cmd.ExecuteNonQuery();

    //    }
    //    catch (MySqlException ex)
    //    {
    //        Console.WriteLine(ex.ToString());
    //        return DBReturnResult.NOT_SUCCESS;
    //    }

    //    return DBReturnResult.SUCCESS;
    //}

}
