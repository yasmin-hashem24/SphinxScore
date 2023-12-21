using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.ComponentModel.DataAnnotations;

namespace SphinxScore
{
    public class User
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string username { get; set; } = " ";

        [Required(ErrorMessage = "Password is required")]
        public string password { get; set; } = " ";

        [Required(ErrorMessage = "First name is required")]
        public string first_name { get; set; } = " ";

        [Required(ErrorMessage = "Last name is required")]
        public string last_name { get; set; } = " ";

        [Required(ErrorMessage = "Birth date is required")]
        public DateTime birth_date { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        public string gender { get; set; } = " ";

        [Required(ErrorMessage = "City is required")]
        public string city { get; set; } = " ";

        public string address { get; set; } = " ";

        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string email_address { get; set; } = " ";

        [Required(ErrorMessage = "Role is required")]
        public string role { get; set; } = " ";
    }
}
