using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;

namespace SphinxScore.Controllers;

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
    public IActionResult AddUser([FromBody] User newUser)
    {
        try
        {
            var existingUser = _userCollection.Find(u => u.username == newUser.username).FirstOrDefault();
            if (existingUser != null)
            {
                ModelState.AddModelError("username", "Username must be unique");
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _userCollection.InsertOne(newUser);
            return Ok("User added successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
}
