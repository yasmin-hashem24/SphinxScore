using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.ComponentModel.DataAnnotations;

namespace SphinxScore;

public class Match
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string _id { get; set; }
    [Required(ErrorMessage = "Home team is required")]
    public string home_team { get; set; } = " ";
    [Required(ErrorMessage = "Away team is required")]
    public string away_team { get; set; } = " ";
    [Required(ErrorMessage = "Match Venue is required")]
    public string match_venue { get; set; } = " ";
    [Required(ErrorMessage = "Match Date is required")]
    public DateTime date_time { get; set; }
    [Required(ErrorMessage = "Main referee is required")]
    public string main_referee { get; set; } = " ";
    [Required(ErrorMessage = "Linesman1 is required")]
    public string linesman1 { get; set; } = " ";
    [Required(ErrorMessage = "Linesman2 is required")]
    public string linesman2 { get; set; } = " ";


   
}
