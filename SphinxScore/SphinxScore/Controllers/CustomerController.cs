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

            if (ticket == null)
            {
                return NotFound($"Ticket not found with ID: {ticketId}");
            }

            Match match = _matchCollection.Find(match => match._id == ticket.MatchId).FirstOrDefault();

            if (match == null)
            {
                return NotFound($"Match not found with ID: {ticket.MatchId}");
            }

            if (match.date_time >= DateTime.Now.AddDays(3))
            {
                Stadium stadium = _stadiumCollection.Find(stadium => stadium.name == match.match_venue).FirstOrDefault();

                if (stadium != null)
                {
                   
                    var filterStadium = Builders<Stadium>.Filter.Eq(stadium_temp => stadium_temp._id, stadium._id);

                    foreach (var seatInfo in ticket.Seats)
                    {
                       
                            int row = seatInfo["row"];
                            int seatNum = seatInfo["seat_num"];

                            var update = Builders<Stadium>.Update.Set($"seats.{row}.{seatNum}", "vacant");
                            _stadiumCollection.UpdateOne(filterStadium, update);
                      
                    }

                    
                    var filter = Builders<Tickets>.Filter.Eq(t => t._id, ticketId);
                    _ticketCollection.DeleteOne(filter);

                    return Ok("Reservation canceled successfully");
                }
                else
                {
                    return NotFound($"Stadium not found for match with ID: {ticket.MatchId}");
                }
            }
            else
            {
                TimeSpan timeRemaining = match.date_time - DateTime.Now;
                return BadRequest($"Ticket can't be canceled before the match. Time remaining: {timeRemaining.Days} days, {timeRemaining.Hours} hours.");
            }
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
            string userId = HttpContext.Session.GetString("UserId");
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

            if (reservationRequest.Seats == null || reservationRequest.Seats.Count == 0)
            {
                return BadRequest("Invalid seat information provided.");
            }

            List<Dictionary<string, int>> reservedSeats = new List<Dictionary<string, int>>();

            foreach (var seatInfo in reservationRequest.Seats)
            {
                if (!seatInfo.ContainsKey("row") || !seatInfo.ContainsKey("seat_num"))
                {
                    return BadRequest("Invalid seat information provided.");
                }

                int row = seatInfo["row"];
                int seatNum = seatInfo["seat_num"];

                if (row >= stadium.rows || seatNum >= stadium.seats_per_row)
                {
                    return BadRequest("Invalid seat numbers provided.");
                }

                if (stadium.seats[row][seatNum] != "vacant")
                {
                    return BadRequest("Selected seats are not vacant.");
                }

                var filter = Builders<Stadium>.Filter.Eq(s => s.name, stadium.name);
                var update = Builders<Stadium>.Update.Set($"seats.{row}.{seatNum}", "Reserved");
                _stadiumCollection.UpdateOne(filter, update);

                reservedSeats.Add(new Dictionary<string, int>
            {
                { "row", row },
                { "seat_num", seatNum },
            });
            }

            var newTicket = new Tickets
            {
                MatchId = matchId,
                CreditCardNumber = reservationRequest.CreditCardNumber,
                PinNumber = reservationRequest.PinNumber,
                Seats = reservedSeats,
            };

            // Create one ticket with all the reserved seats
            _ticketCollection.InsertOne(newTicket);

            var userFilter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var userUpdate = Builders<User>.Update.AddToSet(u => u.ReservedMatchIds, matchId);
            _userCollection.UpdateOne(userFilter, userUpdate);

            return Ok("Reservation made successfully");
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