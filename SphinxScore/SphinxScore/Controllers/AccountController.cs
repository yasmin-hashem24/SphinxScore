using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SphinxScore.Models;
using System;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Collections.Generic;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Match> _matchCollection;
    private readonly IMongoCollection<Stadium> _stadiumCollection;

    public AccountController(IMongoCollection<User> userCollection, IMongoCollection<Match> matchCollection, IMongoCollection<Stadium> stadiumCollection)
    {
        _userCollection = userCollection;
        _matchCollection = matchCollection;
        _stadiumCollection = stadiumCollection;
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
            return Ok("User added successfully. Awaiting approval.");
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
                ModelState.AddModelError("username or password", "Incorrect username or password!");
                return BadRequest(ModelState);
            }

            if (existingUser.IsApproved == false)
            {
                ModelState.AddModelError("username","User Is not Approved Yet");
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("yasminzVerySecretiveKey");

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, existingUser.username),
            new Claim(ClaimTypes.NameIdentifier, existingUser.Id.ToString())
          
        };

            if (!string.IsNullOrEmpty(existingUser.role))
            {
                claims.Add(new Claim(ClaimTypes.Role, existingUser.role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

           
            return Ok(new { Token = tokenString, User = existingUser });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }




    [HttpGet("ViewMatches")]
    public IActionResult ViewMatches()
    {
        try
        {

            var matches = _matchCollection.Find(_ => true).ToList();

            if (matches.Count==0)
            {
                return NotFound($"No Matches Found");
            }

            return Ok(matches);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [HttpGet("ViewMatch/{id}")]
    public IActionResult ViewMatch(string id)
    {
        try
        {
            var match = _matchCollection.Find(match => match._id == id).FirstOrDefault();

            if (match == null)
            {
                return NotFound($"Match not found with ID: {id}");
            }

            return Ok(match);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }


    [HttpGet("ViewStadium/{id}")]
    public IActionResult ViewStadium(string id)
    {
        try
        {
            var match = _stadiumCollection.Find(match => match._id == id).FirstOrDefault();

            if (match == null)
            {
                return NotFound($"Stadium not found with ID: {id}");
            }

            return Ok(match);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
}