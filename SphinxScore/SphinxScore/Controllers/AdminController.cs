using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SphinxScore.Models;
using System;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
  

    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Match> _matchCollection;
    private readonly IMongoCollection<Stadium> _stadiumCollection;

    public AdminController(IMongoCollection<User> userCollection, IMongoCollection<Match> matchCollection, IMongoCollection<Stadium> stadiumCollection)
    {
        _userCollection = userCollection;
        _matchCollection = matchCollection;
        _stadiumCollection = stadiumCollection;
    }


    [HttpGet("NonApprovedUsers")]
    public IActionResult NonApprovedUsers()
    {
        try
        {
            var unapprovedUsers = _userCollection.Find(u => u.IsApproved == false).ToList();
            return Ok(unapprovedUsers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [HttpPatch("ApproveUser/{id}")]
    public IActionResult ApproveUser(string id)
    {
        try
        {
            var user = _userCollection.Find(user => user.Id == id).FirstOrDefault();

            if (user == null)
            {
                return NotFound($"User not found with ID: {id}");
            }
            var filter = Builders<User>.Filter.Eq(user => user.Id, id);
            user.IsApproved= true;
            var updateResult = _userCollection.ReplaceOne(filter, user);

            if (updateResult.ModifiedCount == 1)
            {
                return Ok(user);
            }
            else
            {
                return StatusCode(500, "Error Approving user");
            }

        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [HttpGet("ApprovedUsers")]
    public IActionResult ApprovedUsers()
    {
        try
        {
            var unapprovedUsers = _userCollection.Find(u => u.IsApproved == true).ToList();
            return Ok(unapprovedUsers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [HttpDelete("DeleteUser/{id}")]
    public IActionResult DeleteUser(string id)
    {
        try
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid user ID");
            }

            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var deleteResult = _userCollection.DeleteOne(filter);

            if (deleteResult.DeletedCount == 1)
            {
                return Ok($"User with ID {id} deleted successfully");
            }
            else
            {
                return NotFound($"User with ID {id} not found");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }


}
