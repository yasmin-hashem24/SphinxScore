CREATE MIGRATION m1q2qztwn44t72qczelbw5tlpqvtkz6g2vumb4ekeqa432lv5xbdya
    ONTO initial
{
  CREATE TYPE default::matches {
      CREATE REQUIRED PROPERTY away_team: std::str;
      CREATE REQUIRED PROPERTY date_time: std::datetime;
      CREATE REQUIRED PROPERTY home_team: std::str;
      CREATE REQUIRED PROPERTY linesman1: std::str;
      CREATE REQUIRED PROPERTY linesman2: std::str;
      CREATE REQUIRED PROPERTY main_referee: std::str;
      CREATE REQUIRED PROPERTY match_venue: std::str;
  };
  CREATE TYPE default::user {
      CREATE PROPERTY address: std::str;
      CREATE REQUIRED PROPERTY birth_date: std::datetime;
      CREATE REQUIRED PROPERTY city: std::str;
      CREATE REQUIRED PROPERTY email_address: std::str;
      CREATE REQUIRED PROPERTY first_name: std::str;
      CREATE REQUIRED PROPERTY gender: std::str;
      CREATE REQUIRED PROPERTY last_name: std::str;
      CREATE REQUIRED PROPERTY password: std::str;
      CREATE REQUIRED PROPERTY role: std::str;
      CREATE REQUIRED PROPERTY username: std::str;
  };
};
