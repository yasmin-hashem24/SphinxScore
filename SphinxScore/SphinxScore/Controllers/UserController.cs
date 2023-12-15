using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EdgeDB;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace SphinxScore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly EdgeDBClient _edgeDbClient;
        private readonly ILogger<UserController> _logger;

        public UserController(EdgeDBClient edgeDbClient, ILogger<UserController> logger)
        {
            _edgeDbClient = edgeDbClient;
            _logger = logger;
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var query = "SELECT user { id, username, first_name, last_name, birth_date, gender, city, address, email_address, role }";
                var users = await _edgeDbClient.QueryAsync<User>(query);

                // Log the users using ILogger
                _logger.LogInformation($"Users: {string.Join(", ", users.Select(u => u.username))}");

                return Ok(users);
            }
            catch (Exception ex)
            {
                // Log the exception using ILogger
                _logger.LogError($"Error: {ex.Message}");

                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
