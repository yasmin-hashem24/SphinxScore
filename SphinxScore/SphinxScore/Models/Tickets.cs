using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace SphinxScore.Models;

public class Tickets
{
    //ticket id - matchid - credit card - pin number  

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]

    public string _id { get; set; }
    public string MatchId { get; set; }
    [Required(ErrorMessage = "credit card number is required")]
    public long CreditCardNumber { get; set; }
    [Required(ErrorMessage = "Pin number is required")]

    public int PinNumber { get; set; }
    public int row { get; set; }
    public int seat { get; set; }

}
