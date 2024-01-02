import React, { useState, useEffect } from "react";
import "./GuestPage.css";
import TopBar from "../TopBar/TopBar";
import Button from "@mui/material/Button";
import axios from "axios";

function GuestPage() {
    const [matches, setMatches] = useState([]);
    React.useEffect(() => {
        (async () => {
            await axios
                .get("https://localhost:44345/api/account/ViewMatches")
                .then((response) => {
                    setMatches(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        })();
    }, []);

    function mapMatches(match) {
        return (
            <div className="MatchLayout" key={match.id}>
                <div className="Containers">
                    <div className="Container">
                        <label>Home Team:</label>
                        <p>{match.home_team}</p>
                    </div>
                    <div className="Container">
                        <label>Away Team:</label>
                        <p>{match.away_team}</p>
                    </div>
                    <div className="Container">
                        <label>Venue:</label>
                        <p>{match.match_venue}</p>
                    </div>
                    <div className="Container">
                        <label>Match date:</label>
                        <p>{match.date_time}</p>
                    </div>
                    <div className="Container">
                        <label>Referee:</label>
                        <p>{match.main_referee}</p>
                    </div>
                    <div className="Container">
                        <label>Linesman 1:</label>
                        <p>{match.linesman1}</p>
                    </div>
                    <div className="Container">
                        <label>Linesman 2:</label>
                        <p>{match.linesman2}</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="GuestPageLayout">
            <TopBar user='guest'/>
            <h2>Users</h2>
            <div className="AllGuests">
                {matches.map(mapMatches)}
            </div>
        </div>
    );
}
export default GuestPage;