using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SphinxScore.Models
{
    public class Seat
    {
        public List<Dictionary<string, int>> Seats { get; set; }

        public long CreditCardNumber { get; set; }

        [Required(ErrorMessage = "Pin number is required")]
        public int PinNumber { get; set; }

    }
}
