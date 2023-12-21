using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MangerController : ControllerBase
{
    /*
                     * F3: Create a new match event The EFA managers can create a new match event and
            add all its details.
            F4: Edit the details of an
            existing match.
            The EFA managers can change/edit the details of a
            certain match.
            F5: Add a new stadium. The EFA managers can add a new stadium and define
            its shape and number of seats as shown below.
            F6: View match details The EFA managers can view matches details.
            F7: View vacant/reserved
            seats for each match.
            The EFA managers can view the overall seat status for
            each event (vacant/reserved)
     */

    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Match> _matchCollection;


    public MangerController(IMongoCollection<User> userCollection, IMongoCollection<Match> matchCollection)
    {
        _userCollection = userCollection;
        _matchCollection = matchCollection;
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

    public IActionResult UpdateMatch([FromBody] JObject requestBody)
    {
        try
        {

            string home = requestBody["Home"]?.ToObject<string>();
            string away = requestBody["Away"]?.ToObject<string>();
            var existingMatch = _matchCollection.Find(match => match.home_team == home && match.away_team==away).FirstOrDefault();

            if (existingMatch == null)
            {
                return NotFound($"match not found");
            }

            existingMatch.home_team = requestBody["updatedMatch"]["home_team"]?.ToObject<string>();
            existingMatch.away_team = requestBody["updatedMatch"]["away_team"]?.ToObject<string>();
            existingMatch.match_venue = requestBody["updatedMatch"]["match_venue"]?.ToObject<string>();
            var dateValue = requestBody["updatedMatch"]["date_time"]?.ToObject<DateTime?>();
            existingMatch.date_time = dateValue ?? default(DateTime); 


            existingMatch.main_referee = requestBody["updatedMatch"]["main_referee"]?.ToObject<string>();
            existingMatch.linesman1 = requestBody["updatedMatch"]["linesman1"]?.ToObject<string>();
            existingMatch.linesman2 = requestBody["updatedMatch"]["linesman2"]?.ToObject<string>();



            TryValidateModel(existingMatch);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(existingMatch);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

}
