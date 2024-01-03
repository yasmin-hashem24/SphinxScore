using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using SphinxScore.Models;
using System;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "manager")]
public class MangerController : ControllerBase
{

    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Match> _matchCollection;
    private readonly IMongoCollection<Stadium> _stadiumCollection;

    public MangerController(IMongoCollection<User> userCollection, IMongoCollection<Match> matchCollection, IMongoCollection<Stadium> stadiumCollection)
    {
        _userCollection = userCollection;
        _matchCollection = matchCollection;
        _stadiumCollection = stadiumCollection;
    }

    [HttpPost("CreateMatch")]
    public IActionResult AddMatch([FromBody] Match newMatch)
    {
        try
        {
            var filter = Builders<Stadium>.Filter.Eq(u => u.name, newMatch.match_venue);
            var stad = _stadiumCollection.Find(filter).FirstOrDefault();

            if (stad == null)
            {
                return NotFound($"Stadium not found.");
            }
            if (stad.IsReserved)
            {
                ModelState.AddModelError("stadium", "Stadium is busy and can't be booked for matches currently");
                return BadRequest(ModelState);

            }
            var filter1 = Builders<Stadium>.Filter.Eq(s => s.name, stad.name);

            var update = Builders<Stadium>.Update.Set(s => s.IsReserved, true);

            var updateResult = _stadiumCollection.UpdateOne(filter1, update);
            _matchCollection.InsertOne(newMatch);
            return Ok("Match added successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [HttpPatch("UpdateMatch/{id}")]
    public IActionResult UpdateMatch(string id, [FromBody] MatchUpdateModel requestBody)
    {
        try
        {
            if (requestBody == null)
            {
                return BadRequest("Invalid JSON data");
            }

            var existingMatch = _matchCollection.Find(match => match._id == id).FirstOrDefault();

            if (existingMatch == null)
            {
                return NotFound($"Match not found");
            }

            var filter = Builders<Match>.Filter.Eq(match => match._id, id);

            var updateDefinition = Builders<Match>.Update
                .Set(m => m.home_team, string.IsNullOrWhiteSpace(requestBody.home_team) ? existingMatch.home_team : requestBody.home_team)
                .Set(m => m.away_team, string.IsNullOrWhiteSpace(requestBody.away_team) ? existingMatch.away_team : requestBody.away_team)
                .Set(m => m.match_venue, string.IsNullOrWhiteSpace(requestBody.match_venue) ? existingMatch.match_venue : requestBody.match_venue)
                .Set(m => m.main_referee, string.IsNullOrWhiteSpace(requestBody.main_referee) ? existingMatch.main_referee : requestBody.main_referee)
                .Set(m => m.linesman1, string.IsNullOrWhiteSpace(requestBody.linesman1) ? existingMatch.linesman1 : requestBody.linesman1)
                .Set(m => m.linesman2, string.IsNullOrWhiteSpace(requestBody.linesman2) ? existingMatch.linesman2 : requestBody.linesman2);

            var updateResult = _matchCollection.UpdateOne(filter, updateDefinition);


            if (updateResult.ModifiedCount == 1)
            {
                return Ok("match updated");
            }
            else
            {
                return StatusCode(500, "Error updating the match");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }


    [HttpPost("AddStadium")]
    public IActionResult AddStadoum([FromBody] Stadium newStadoum)
    {
        try
        {
            newStadoum.InitializeSeats();
        
            _stadiumCollection.InsertOne(newStadoum);
            return Ok("Stadium added successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

   


    



}
