module default {
     type user {
        required property username -> str ;
        required property password -> str;
        required property first_name -> str;
        required property last_name -> str;
        required property birth_date -> datetime;
        required property gender -> str;
        required property city -> str;
        property address -> str;
        required property email_address -> str;
        required property role -> str;
    }
    type matches {
        required property home_team -> str;
        required property away_team -> str;
        required property match_venue -> str;
        required property date_time -> datetime;
        required property main_referee -> str;
        required property linesman1 -> str;
        required property linesman2 -> str;
    }

}
