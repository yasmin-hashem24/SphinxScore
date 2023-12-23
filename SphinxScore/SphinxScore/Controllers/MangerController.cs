using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using SphinxScore.Models;
using System;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MangerController : ControllerBase
{
    /*
                     
            F7: View vacant/reserved
            seats for each match.
            The EFA managers can view the overall seat status for
            each event (vacant/reserved)
     */

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
            _stadiumCollection.InsertOne(newStadoum);
            return Ok("Stadium added successfully");
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



}
