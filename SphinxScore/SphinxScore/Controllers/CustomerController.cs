using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SphinxScore.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    /*
     * Feature Description
F8: Edit their data. The customer can edit their personal data (except for
the username and email address).
F9: View matches details The customer can view all matches details as well as
the vacant seats for each match.
F10: Reserve vacant seat(s)
in future matches.
The customer can select vacant seat/s only.
The customer is asked to enter a credit card number &
its pin number.
Then the reservation is confirmed and a reservation
ticket number (unique) is generated.
F11: Cancel a reservation The customer can cancel a reserved ticket only 3 days
before the start of the event.
The seat/s in the reservation should be vacant again.
     * */
}
