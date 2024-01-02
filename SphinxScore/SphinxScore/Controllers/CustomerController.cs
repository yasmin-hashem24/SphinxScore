using Amazon.Runtime.Internal.Transform;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using SphinxScore.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Numerics;
using System.Text.Json;
using System.Text.RegularExpressions;
using static MongoDB.Driver.WriteConcern;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "fan")]
public class CustomerController : ControllerBase
{

   
    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Match> _matchCollection;
    private readonly IMongoCollection<Stadium> _stadiumCollection;
    private readonly IMongoCollection<Tickets> _ticketCollection;
    public CustomerController(IMongoCollection<User> userCollection, IMongoCollection<Match> matchCollection, IMongoCollection<Stadium> staduimCollection, IMongoCollection<Tickets> ticketCollection)
    {
        _userCollection = userCollection;
        _matchCollection = matchCollection;
        _stadiumCollection = staduimCollection;
        _ticketCollection = ticketCollection;
    }
    [HttpPatch("EditUser")]
    public IActionResult EditUser([FromBody] User ourUser)  // hal acheck en el email el mb3ot mokhtlef 3n el 3ndy fy el db , wla fy el front end msh hys7mlo ygher el email
    {
        try
        {
            //JObject requestBody = JsonSerializer.Serialize<User>(ourUser);

            string username = ourUser.username;
            DateTime DefaultValue = new DateTime(3000, 01, 01, 00, 00, 00, DateTimeKind.Utc);
            var existingUser = _userCollection.Find(user => user.username == username).FirstOrDefault();
            if (existingUser == null)
            {
                return NotFound($"User not found");
            }

            var filter = Builders<User>.Filter.Eq(user => user.username, username);

            var update = Builders<User>.Update.Set("password", ourUser.password != " " ? ourUser.password : existingUser.password)
                .Set("city", ourUser.city != " " ? ourUser.city : existingUser.city)
                .Set("address", ourUser.address != " " ? ourUser.address : existingUser.address)
                .Set("first_name", ourUser.first_name != " " ? ourUser.first_name : existingUser.first_name)
                .Set("last_name", ourUser.last_name != " " ? ourUser.last_name : existingUser.last_name)
                .Set("gender", ourUser.gender != " " ? ourUser.gender : existingUser.gender)
                .Set("birth_date", ourUser.birth_date.Equals(default(DateTime)) ? existingUser.birth_date : ourUser.birth_date);

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
    [HttpGet("ViewMatch/{id}")]
    public IActionResult ViewMatchDeatils(string id)
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
    [HttpGet("ViewVacantSeats/{id}")]
    public IActionResult ViewVacantSeats(string id)
    {
        try
        {
            var match = _matchCollection.Find(match => match._id == id).FirstOrDefault();
            var stadium = _stadiumCollection.Find(stadium => stadium.name == match.match_venue).FirstOrDefault();
            Dictionary<int, List<int>> vacant_seats = new Dictionary<int, List<int>>();

            for (int i = 0; i < stadium.rows; i++)
            {
                List<int> temp = new List<int>();
                for (int j = 0; j < stadium.seats_per_row; j++)
                {
                    if (i < stadium.seats.Count && j < stadium.seats[i].Count&& stadium.seats[i][j] == "vacant")
                    {
                        temp.Add(j);
                    }
                }
                vacant_seats.Add(i, temp);
            }

            if (match == null)
            {
                return NotFound($"Match not found with ID: {id}");
            }
            return Ok(vacant_seats);

        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    

    [HttpPost("CancelReservation/{ticketId}")]
    public IActionResult CancelReservation(string ticketId)
    {
        try
        {
            Tickets ticket = _ticketCollection.Find(ticket => ticket._id == ticketId).FirstOrDefault();


            Match match = _matchCollection.Find(match => match._id == ticket.MatchId).FirstOrDefault();


            if (match.date_time >= DateTime.Now.AddDays(3))
            {

                Stadium stadium = _stadiumCollection.Find(stadium => stadium.name == match.match_venue).FirstOrDefault();
                //update the seat
                var filterStadium = Builders<Stadium>.Filter.Eq(stadium_temp => stadium_temp._id, stadium._id);
                var update = Builders<Stadium>.Update.Set($"seats.{ticket.row}.{ticket.seat}", "vacant");
                _stadiumCollection.UpdateOne(filterStadium, update);

                //delete ticket
                var filter = Builders<Tickets>.Filter.Eq(ticket => ticket._id, ticketId);
                _ticketCollection.DeleteOne(filter);

            }

            else
            {
                return Content($"Ticket can't be deleted before the match by {match.date_time - DateTime.Now} only ");
            }

            if (ticket == null)
            {
                return NotFound($"Match not found with ID: {ticketId}");
            }

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [HttpPost("ReserveVacantSeats/{matchId}")]
    public IActionResult ReserveVacantSeats(string matchId, [FromBody] Seat reservationRequest)
    {
        try
        {

            var match = _matchCollection.Find(m => m._id == matchId).FirstOrDefault();
            if (match == null)
            {
                return NotFound($"Match not found with ID: {matchId}");
            }

           
            if (match.date_time <= DateTime.Now)
            {
                return BadRequest("Cannot reserve seats for past matches.");
            }

           
            var stadium = _stadiumCollection.Find(s => s.name == match.match_venue).FirstOrDefault();
            if (stadium == null)
            {
                return NotFound($"Stadium not found for match with ID: {matchId}");
            }

            if (stadium.rows< reservationRequest.row || stadium.seats_per_row < reservationRequest.seat_num)
            {
                return BadRequest("Invalid seat numbers provided.");
            }

            if (stadium.seats[reservationRequest.row][reservationRequest.seat_num] != "")
            {
                return BadRequest("Selected seats are not vacant.");
            }
            var filter = Builders<Stadium>.Filter.Eq(s => s.name, stadium.name);
            var update = Builders<Stadium>.Update.Set($"seats.{reservationRequest.row}.{reservationRequest.seat_num}", "Reserved");
            _stadiumCollection.UpdateOne(filter, update);


            var newTicket = new Tickets
            {
                MatchId = matchId,
                row = reservationRequest.row,
                seat = reservationRequest.seat_num,
               
              
            };
            _ticketCollection.InsertOne(newTicket);

            return Ok("reservation made successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
    

    [HttpGet("ViewReservedOrNotMatch")]
    public IActionResult ViewReservedOrNotMatch()
    {
        try
        {
            string user_id = HttpContext.Session.GetString("UserId");
            var filter = Builders<User>.Filter.Eq(u => u.Id, user_id);
            var ourUser = _userCollection.Find(filter).FirstOrDefault();

            if (ourUser == null)
            {
                return NotFound($"User with ID {user_id} not found.");
            }

            var reservedMatches = ourUser.ReservedMatchIds;
            var allMatches = _matchCollection.Find(_ => true).ToList();

           
            var matchesWithReservationStatus = allMatches.Select(match =>
            {
                bool isReserved = reservedMatches.Contains(match._id);
                return new
                {
                    TheMatch= match,
                   
                    IsReserved = isReserved
                };
            }).ToList();

            return Ok(matchesWithReservationStatus);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

}