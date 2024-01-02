using System.ComponentModel.DataAnnotations;

namespace SphinxScore.Models
{
    public class Seat
    {
        public int row { get; set; }
        public int seat_num { get; set; }

        public long CreditCardNumber { get; set; }
        [Required(ErrorMessage = "Pin number is required")]

        public int PinNumber { get; set; }

    }
}
