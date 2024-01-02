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

    [HttpPatch("UpdateMatch")]
    public IActionResult UpdateMatch([FromBody] MatchUpdateModel requestBody)
    {
        try
        {
            if (requestBody == null)
            {
                return BadRequest("Invalid JSON data");
            }

            var home = requestBody.Home;
            var away = requestBody.Away;

            if (string.IsNullOrEmpty(home) || string.IsNullOrEmpty(away))
            {
                return BadRequest("Invalid 'Home' or 'Away' values");
            }

            var existingMatch = _matchCollection.Find(match => match.home_team == home && match.away_team == away).FirstOrDefault();
            if (existingMatch == null)
            {
                return NotFound($"Match not found");
            }

            var filter = Builders<Match>.Filter.Eq(match => match.home_team, home) & Builders<Match>.Filter.Eq(match => match.away_team, away);
            existingMatch.home_team = requestBody.UpdatedMatch.home_team;
            existingMatch.away_team = requestBody.UpdatedMatch.away_team;
            existingMatch.match_venue = requestBody.UpdatedMatch.match_venue;
            existingMatch.date_time = requestBody.UpdatedMatch.date_time;
            existingMatch.main_referee = requestBody.UpdatedMatch.main_referee;
            existingMatch.linesman1 = requestBody.UpdatedMatch.linesman1;
            existingMatch.linesman2 = requestBody.UpdatedMatch.linesman2;

           
            var updateResult = _matchCollection.ReplaceOne(filter, existingMatch);

            if (updateResult.ModifiedCount == 1)
            {
                return Ok(existingMatch);
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
