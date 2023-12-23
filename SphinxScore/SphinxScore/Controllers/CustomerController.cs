using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Text.Json;
using static MongoDB.Driver.WriteConcern;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    
    /*
     * Feature Description
F8: Edit their data. The customer can edit their personal data (except for
the username and email address).
F9: View matches details The customer can view all matches details as well as
the vacant seats for each match.
F10: Reserve vacant seat(s)
in future matches.
The customer can select vacant seat/s only.
The customer is asked to enter a credit card number &
its pin number.
Then the reservation is confirmed and a reservation
ticket number (unique) is generated.
F11: Cancel a reservation The customer can cancel a reserved ticket only 3 days
before the start of the event.
The seat/s in the reservation should be vacant again.
     * */
    private readonly IMongoCollection<User> _userCollection;
    public CustomerController(IMongoCollection<User> userCollection)
    {
        _userCollection = userCollection;
    }
    [HttpPatch("EditUser")]
    public IActionResult EditUser([FromBody] User ourUser)  // hal acheck en el email el mb3ot mokhtlef 3n el 3ndy fy el db , wla fy el front end msh hys7mlo ygher el email
    {
        try
        {
            //JObject requestBody = JsonSerializer.Serialize<User>(ourUser);

            string username = ourUser.username ;
            DateTime DefaultValue = new DateTime(3000, 01, 01, 00, 00, 00, DateTimeKind.Utc);
            var existingUser = _userCollection.Find(user => user.username == username).FirstOrDefault();
            if (existingUser == null)
            {
                return NotFound($"User not found");
            }

            //existingUser.birth_date = ourUser.birth_date.Equals("0001 - 01 - 01T00: 00:00") ? existingUser.birth_date : ourUser.birth_date  ;
            //existingUser.password = ourUser.password != " " ? ourUser.password : existingUser.password;
            //existingUser.city = ourUser.city != " " ? ourUser.city : existingUser.city;
            //existingUser.address = ourUser.address != " " ? ourUser.address: existingUser.address;
            //existingUser.first_name = ourUser.first_name != " " ? ourUser.first_name : existingUser.first_name;
            //existingUser.last_name = ourUser.last_name != " " ? ourUser.last_name : existingUser.last_name;
            //existingUser.gender = ourUser.gender != " " ? ourUser.gender : existingUser.gender;

            var filter = Builders<User>.Filter.Eq(user => user.username, username);

            var update = Builders<User>.Update.Set("password",ourUser.password != " " ? ourUser.password : existingUser.password)
                .Set("city", ourUser.city != " " ? ourUser.city : existingUser.city)
                .Set("address",ourUser.address != " " ? ourUser.address : existingUser.address)
                .Set("first_name",ourUser.first_name != " " ? ourUser.first_name : existingUser.first_name)
                .Set("last_name",ourUser.last_name != " " ? ourUser.last_name : existingUser.last_name)
                .Set("gender", ourUser.gender != " " ? ourUser.gender : existingUser.gender)
                .Set("birth_date" , ourUser.birth_date==default(DateTime) ? existingUser.birth_date : ourUser.birth_date);

           // _userCollection.ReplaceOne(filter, existingUser);
            _userCollection.UpdateOne(filter, update);
            TryValidateModel(existingUser);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(existingUser);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }

    }
}
