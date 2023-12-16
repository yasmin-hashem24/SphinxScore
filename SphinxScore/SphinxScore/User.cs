using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;

namespace SphinxScore
{
    public class User
    {

        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string username { get; set; } = " ";
            public string password { get; set; } = " ";
            public string first_name { get; set; } = " ";
            public string last_name { get; set; } = " ";
            public DateTime birth_date { get; set; }
            public string gender { get; set; } = " ";
            public string city { get; set; } = " ";
            public string address { get; set; } = " ";
            public string email_address { get; set; } = " ";
            public string role { get; set; } = " ";

          
        }
}
