using System;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using SimpleExpenditureTracker.Database;
using SimpleExpenditureTracker.Objects;

namespace SimpleExpenditureTracker.Controllers
{
    [ApiController]
    [Route("api/signin")]
    public class SignInController : ControllerBase
    {

        [HttpPost]
        public IActionResult Post([FromBody] SignInObject obj)
        {
            String userLoginID = obj.UserLoginID.ToUpper().Trim();
            String userPassword = obj.HashedPassword.Trim();

            String returnPassword = null; ;
            DatabaseConnector.DBReturnResult dBReturnResult;

            dBReturnResult = DatabaseConnector.Instance.QueryUserPassword(userLoginID, ref returnPassword);

            //Console.WriteLine("Returned Pwd = " + returnPassword);
            if (returnPassword != null)
            {
                if (returnPassword.Equals(userPassword))
                {
                    String UserUUID = null;

                    dBReturnResult = DatabaseConnector.Instance.QueryUserUUID(userLoginID, ref UserUUID);
                    //Console.WriteLine("UUID Returned : " + UserUUID);


                    DatabaseConnector.Instance.UpdateLastLoginTimestamp(UserUUID);
                    //Console.WriteLine("Updated Login Timestamp");


                    string UserFullName = null;

                    dBReturnResult = DatabaseConnector.Instance.QueryUserName(UserUUID, ref UserFullName);
                    //Console.WriteLine("Get User's Full Name : " + UserFullName);

                    string Role = null;
                    dBReturnResult = DatabaseConnector.Instance.QueryUserRole(UserUUID, ref Role);
                    //Console.WriteLine("Get User's Role : " + Role);


                    //Console.WriteLine("Generate JSON String.");
                    SignInReturnObject retObj = new SignInReturnObject();

                    retObj.UserUUID = UserUUID;
                    retObj.UserFullName = UserFullName;
                    retObj.Role = Role;

                    string jsonString = CommonTools.CommonTools.Instance.ConvertObjectToJSONString(retObj);

                    return Ok(jsonString);
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return StatusCode(401);

        }
    }

    [ApiController]
    [Route("api/changepassword")]
    public class ChangePasswordController : ControllerBase
    {

        [HttpPost]
        public IActionResult Post([FromBody] ChangePasswordObject obj)
        {

            bool success = false;

            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.ChangeUserPassword(obj.UserUUID.ToString(), obj.HashedOldPassword, obj.HashedNewPassword, ref success);

            Console.WriteLine("Returned returnResult = " + returnResult);

            if (returnResult == DatabaseConnector.DBReturnResult.SUCCESS)
            {
                Console.WriteLine("QueryTotalExpenditureByUserController Success.");

                return Ok("{Result: Success}");
            }
            return StatusCode(400);

        }
    }

    [ApiController]
    [Route("api/adduser")]
    public class AddUserController : ControllerBase
    {

        [HttpPost]
        public IActionResult Post([FromBody] CreateUpdateUserObject obj)
        {
            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.AddUser(obj);

            Console.WriteLine("Returned returnResult = " + returnResult);

            if (returnResult == DatabaseConnector.DBReturnResult.SUCCESS)
            {
                Console.WriteLine("QueryTotalExpenditureByUserController Success.");

                return Ok("{Result: Success}");
            }
            return StatusCode(400);

        }
    }

    [ApiController]
    [Route("api/getallusers")]
    public class GetAllUserController : ControllerBase
    {

        [HttpGet]
        public IEnumerable<SignInReturnObject> Get()
        {
            List<SignInReturnObject> ListOfReturnObject = new List<SignInReturnObject>();

            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.QueryAllUser(ref ListOfReturnObject);

            return Enumerable.Range(1, ListOfReturnObject.Count).Select(index => new SignInReturnObject
            {
                UserUUID = ListOfReturnObject[index - 1].UserUUID,
                UserFullName = ListOfReturnObject[index - 1].UserFullName,
                UserLoginID = ListOfReturnObject[index - 1].UserLoginID,
                Role = ListOfReturnObject[index - 1].Role
            })
           .ToArray();
        }



        [HttpPost]
        public IActionResult Post([FromBody] UserUUIDObject obj)
        {
            List<SignInReturnObject> qeoList = new List<SignInReturnObject>();

            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.QueryAllUser(ref qeoList);

            Console.WriteLine("Returned returnResult = " + returnResult);

            if (returnResult == DatabaseConnector.DBReturnResult.SUCCESS)
            {
                Console.WriteLine("QueryTotalExpenditureByUserController Success.");

                string jsonString = CommonTools.CommonTools.Instance.ConvertObjectToJSONString(qeoList);

                return Ok(jsonString); ;
            }
            return StatusCode(400);

        }
    }

    [ApiController]
    [Route("api/deleteuser")]
    public class DeleteUserController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] UserUUIDObject obj)
        {
            Console.WriteLine("obj.UserUUID : " + obj.UserUUID);
            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.DeleteUser(obj.UserUUID);

            Console.WriteLine("Returned returnResult = " + returnResult);

            if (returnResult == DatabaseConnector.DBReturnResult.SUCCESS)
            {
                return Ok("{Result: Success}"); ;
            }
            return StatusCode(400);

        }
    }
}
