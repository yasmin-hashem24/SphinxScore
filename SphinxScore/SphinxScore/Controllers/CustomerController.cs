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
    public IActionResult EditUser([FromBody] TempUser ourUser)
    {
        try
        {
            if (ourUser == null)
            {
                return BadRequest("Invalid JSON data");
            }

            string userId = HttpContext.Session.GetString("UserId");

            var existingUser = _userCollection.Find(user => user.Id == userId).FirstOrDefault();
            if (existingUser == null)
            {
                return NotFound($"User not found");
            }

            var filter = Builders<User>.Filter.Eq(user => user.Id, userId);

            var updateDefinition = Builders<User>.Update
                .Set(u => u.password, string.IsNullOrWhiteSpace(ourUser.password) ? existingUser.password : ourUser.password)
                .Set(u => u.city, string.IsNullOrWhiteSpace(ourUser.city) ? existingUser.city : ourUser.city)
                .Set(u => u.address, string.IsNullOrWhiteSpace(ourUser.address) ? existingUser.address : ourUser.address)
                .Set(u => u.first_name, string.IsNullOrWhiteSpace(ourUser.first_name) ? existingUser.first_name : ourUser.first_name)
                .Set(u => u.last_name, string.IsNullOrWhiteSpace(ourUser.last_name) ? existingUser.last_name : ourUser.last_name);


            if (existingUser.birth_date != null)
            {
                updateDefinition = updateDefinition.Set(u => u.birth_date, existingUser.birth_date);
            }

            if (!string.IsNullOrWhiteSpace(existingUser.gender))
            {
                updateDefinition = updateDefinition.Set(u => u.gender, existingUser.gender);
            }

            if (!string.IsNullOrWhiteSpace(existingUser.email_address))
            {
                updateDefinition = updateDefinition.Set(u => u.email_address, existingUser.email_address);
            }

            if (!string.IsNullOrWhiteSpace(existingUser.role))
            {
                updateDefinition = updateDefinition.Set(u => u.role, existingUser.role);
            }

            _userCollection.UpdateOne(filter, updateDefinition);

            var updatedUser = _userCollection.Find(user => user.Id == userId).FirstOrDefault();

            TryValidateModel(updatedUser);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(updatedUser);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
    [HttpGet("ViewUser")]
    public IActionResult ViewUser()
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


            return Ok(ourUser);
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



    [HttpPost("CancelReservation/{match_id}")]
    public IActionResult CancelReservation(string match_id)
    {
        try
        {
            string userId = HttpContext.Session.GetString("UserId");
            Tickets ticket = _ticketCollection
     .Find(ticket => ticket.MatchId == match_id && ticket.UserId == userId)
     .FirstOrDefault();

            if (ticket == null)
            {
                return NotFound($"Ticket not found with Match ID: {match_id} and user_id:{userId}");
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

                        var updatee = Builders<Stadium>.Update.Set($"seats.{row}.{seatNum}", "vacant");
                        _stadiumCollection.UpdateOne(filterStadium, updatee);

                    }


                    var filter = Builders<Tickets>.Filter.Eq(t => t.MatchId, match_id) & Builders<Tickets>.Filter.Eq(t => t.UserId, userId);
                    _ticketCollection.DeleteOne(filter);



                    var filter_user = Builders<User>.Filter.Eq(u => u.Id, userId);
                    var update = Builders<User>.Update.Pull(u => u.ReservedMatchIds, match_id);
                    var updateResult = _userCollection.UpdateOne(filter_user, update);



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
                UserId = userId,
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