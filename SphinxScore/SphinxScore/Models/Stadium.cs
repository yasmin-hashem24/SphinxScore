using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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
    //[Required(ErrorMessage = "number of rows is required")]
    //public int rows { get; set; }
    [Required(ErrorMessage = "number of seats per row is required")]
    public int seats_per_row { get; set; }
    public Dictionary<int, Dictionary<int,string>> rows { get; set; }

}
