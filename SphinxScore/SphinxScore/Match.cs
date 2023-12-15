using System;

namespace SphinxScore
{
    public class Match
    {
       
        public string home_team { get; set; } = " ";
        public string away_team { get; set; } = " ";
        public string match_venue { get; set; } = " ";
        public DateTime date_time { get; set; }
        public string main_referee { get; set; } = " ";
        public string linesman1 { get; set; } = " ";
        public string linesman2 { get; set; } = " ";

 
        public Match(string home_team, string away_team, string match_venue,
                     DateTime date_time, string main_referee, string linesman1, string linesman2)
        {
            this.home_team = home_team;
            this.away_team = away_team;
            this.match_venue = match_venue;
            this.date_time = date_time;
            this.main_referee = main_referee;
            this.linesman1 = linesman1;
            this.linesman2 = linesman2;
        }
    }
}
