using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace SphinxScore;

public class Stadium
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
   
    public string _id { get; set; }
    [Required(ErrorMessage = "Stadium name is required")]
    public string name { get; set; }
    [Required(ErrorMessage = "Stadium location is required")]
    public string location { get; set; }
    [Required(ErrorMessage = "number of rows is required")]
    public int rows { get; set; }

    [Required(ErrorMessage = "number of seats per row is required")]
    public int seats_per_row { get; set; }
    public List<List<string>> seats { get; set; }

    public bool IsReserved { get; set; } = false;

    public void InitializeSeats()
    {
        seats = new List<List<string>>();

        for (int i = 1; i <= rows; i++)
        {
            List<string> rowSeats = Enumerable.Repeat("vacant", seats_per_row).ToList();
            seats.Add(rowSeats);
        }
    }}

public class SeatRow
{
    public int row { get; set; }
    public List<string> seats { get; set; }
}
