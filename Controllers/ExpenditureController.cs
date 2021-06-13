using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SimpleExpenditureTracker.Database;
using SimpleExpenditureTracker.Objects;

namespace A_Simple_Web_App.Controllers
{

    [ApiController]
    [Route("api/createexpenditure")]
    public class CreateExpenditureController : ControllerBase
    {

        [HttpPost]
        public IActionResult Post([FromBody] CreateExpenditureObject obj)
        {
            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.CreateNewExpenditureRecord(obj);

            Console.WriteLine("Returned returnResult = " + returnResult);

            if (returnResult == DatabaseConnector.DBReturnResult.SUCCESS)
            {
                Console.WriteLine("CreateNewExpenditureRecord Success.");

                return Ok("Success");
            }
            return StatusCode(400);

        }


    }


    [ApiController]
    [Route("api/querytotalexpenditurebyuser")]
    public class QueryTotalExpenditureByUserController : ControllerBase
    {

        [HttpPost]
        public IActionResult Post([FromBody] UserUUIDObject obj)
        {
            float returnValue = 0.0f;

            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.QueryTotalExpenditureByUser(obj.UserUUID.ToString(), ref returnValue);

            Console.WriteLine("Returned returnResult = " + returnResult + " " + returnValue);

            if (returnResult == DatabaseConnector.DBReturnResult.SUCCESS)
            {
                Console.WriteLine("QueryTotalExpenditureByUserController Success.");

                return Ok(returnValue);
            }
            return StatusCode(400);

        }
    }

    [ApiController]
    [Route("api/populatedetailedpenditurebyuser")]
    public class QueryDetailedExpenditureByUserController : ControllerBase
    {

        [HttpPost]
        public IActionResult Post([FromBody] UserUUIDObject obj)
        {
            List<QueryExpenditureObject> qeoList = new List<QueryExpenditureObject>();

            DatabaseConnector.DBReturnResult returnResult = DatabaseConnector.Instance.QueryExpenditureRecord(obj.UserUUID.ToString(), ref qeoList);

            Console.WriteLine("Returned returnResult = " + returnResult );

            if (returnResult == DatabaseConnector.DBReturnResult.SUCCESS)
            {
                Console.WriteLine("QueryTotalExpenditureByUserController Success.");

                string jsonString = CommonTools.CommonTools.Instance.ConvertObjectToJSONString(qeoList);

                Console.WriteLine(jsonString);

                return Ok(jsonString); ;
            }
            return StatusCode(400);

        }
    }
}
