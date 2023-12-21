using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SphinxScore.Models;
using System;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IMongoCollection<User> _userCollection;

    public AccountController(IMongoCollection<User> userCollection)
    {
        _userCollection = userCollection;
    }

    [HttpPost("SignUp")]
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


    [HttpPost("Login")]
    public IActionResult LoginUser([FromBody] Login loginUser)
    {
        if (string.IsNullOrEmpty(loginUser.username) || string.IsNullOrEmpty(loginUser.password))
        {
            ModelState.AddModelError("credentials", "Username and password are required");
            return BadRequest(ModelState);
        }
        try
        {
            var existingUser = _userCollection.Find(u => u.username == loginUser.username && u.password == loginUser.password).FirstOrDefault();
            if (existingUser == null)
            {
                ModelState.AddModelError("username or password","Incorrect username or password!");
                return BadRequest(ModelState);
            }
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