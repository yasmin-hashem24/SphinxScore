using System.ComponentModel.DataAnnotations;

namespace SphinxScore.Models
{
    public class Stadium
    {
        [Required(ErrorMessage = "Stadium name is required")]
        public string name { get; set; }
        [Required(ErrorMessage = "Stadium location is required")]
        public string location { get; set; }
        [Required(ErrorMessage = "number of rows is required")]
        public int rows { get; set; }
        [Required(ErrorMessage = "number of seats per row is required")]
        public int seats_per_row { get; set; }
    }
}
