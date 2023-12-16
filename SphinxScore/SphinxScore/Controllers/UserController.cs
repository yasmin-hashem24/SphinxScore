using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;

namespace SphinxScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserController(IMongoCollection<User> userCollection)
        {
            _userCollection = userCollection;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _userCollection.Find(_ => true).ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("AddUser")]
        public IActionResult AddUser()
        {
            try
            {
                var newUser = new User
                {
                    username = "john_doe",
                    password = "password123",
                    first_name = "John",
                    last_name = "Doe",
                    birth_date = new DateTime(1990, 1, 1),
                    gender = "Male",
                    city = "City",
                    address = "123 Main St",
                    email_address = "john.doe@example.com",
                    role = "User"
                };

                _userCollection.InsertOne(newUser);
                return Ok("User added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
