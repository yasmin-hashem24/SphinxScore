using System;

namespace SphinxScore
{
    public class User
    {
    
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

            public User(string username, string password, string first_name, string last_name,
                        DateTime birth_date, string gender, string city, string address,
                        string email_address, string role)
            {
                this.username = username;
                this.password = password;
                this.first_name = first_name;
                this.last_name = last_name;
                this.birth_date = birth_date;
                this.gender = gender;
                this.city = city;
                this.address = address;
                this.email_address = email_address;
                this.role = role;
            }
        }
}
