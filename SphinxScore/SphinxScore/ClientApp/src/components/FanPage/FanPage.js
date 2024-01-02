// page to show all matchs
// has a nav bar that goes to My Matches

import React, { useState, useEffect } from "react";
import "./FanPage.css";
import TopMenu from "./TopMenu";
import Button from "@mui/material/Button";
import axios from "axios";
import { useHistory } from 'react-router-dom';

const matches = [
    {
        "theMatch": {
            "_id": "6583873af4f11746922f4cdf",
            "home_team": "TeamYasmin",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-03T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "658427e0a4754b2e177804b0",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-05T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "65864e3f612162f93e81c6c8",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "658779dcc8bf2e1e1e9144b0",
            "home_team": "Team3",
            "away_team": "Team4",
            "match_venue": "Stadium3",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "65937450104f5c3d2940de73",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "659376cd6858f2249cefa5d7",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "659376dd6858f2249cefa5d8",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "659376f76858f2249cefa5d9",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "659377286858f2249cefa5da",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    },
    {
        "theMatch": {
            "_id": "659378478d1b797d4dd72ed2",
            "home_team": "Team1",
            "away_team": "Team2",
            "match_venue": "Stadium1",
            "date_time": "2024-01-01T10:00:00Z",
            "main_referee": "RefereeName",
            "linesman1": "Linesman1",
            "linesman2": "Linesman2"
        },
        "isReserved": false
    }
]

function FanPage() {
    const [reservedMatches, setReservedMatches] = useState([]);
    const [changed, setChanged] = useState(false);
    const token = localStorage.getItem("token");
    const history = useHistory();
    React.useEffect(() => {
        (async () => {
            await axios
                .get("https://localhost:44345/api/account/ViewMatches", {
                    headers: { Authorization: `bearer ${token}` },
                })
                .then((response) => {
                    setReservedMatches(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        })();
    }, [changed]);

    function mapMatches(match) {
        return (
            <div className="MatchLayout" key={match.theMatch.id}>
                <div className="Containers">
                    <div className="Container">
                        <label>Home Team:</label>
                        <p>{match.theMatch.home_team}</p>
                    </div>
                    <div className="Container">
                        <label>Away Team:</label>
                        <p>{match.theMatch.away_team}</p>
                    </div>
                    <div className="Container">
                        <label>Match Venue:</label>
                        <p>{match.theMatch.match_venue}</p>
                    </div>
                    <div className="Container">
                        <label>Date-Time:</label>
                        <p>{match.theMatch.date_time}</p>
                    </div>
                    <div className="Container">
                        <label>Main Referee:</label>
                        <p>{match.theMatch.main_referee}</p>
                    </div>
                    <div className="Container">
                        <label>Linesman 1:</label>
                        <p>{match.theMatch.linesman1}</p>
                    </div>
                    <div className="Container">
                        <label>Linesman 2:</label>
                        <p>{match.theMatch.linesman2}</p>
                    </div>
                </div>
                <div className="Buttons">
                    {!match.theMatch.isReserved && (
                        <Button
                            variant="contained"
                            style={{ margin: "4px" }}
                            color="success"
                            data-user-id={match.id}
                            onClick={handleReserve}
                        >
                            Reserve
                        </Button>
                    )}
                    {match.theMatch.isReserved && (
                        <Button
                            variant="contained"
                            style={{ margin: "4px" }}
                            color="#3A4D39"
                            data-user-id={match.id}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>
        );
    }
    function handleReserve(e) {
        if (changed) {
            setChanged(false);
        } else {
            setChanged(true);
        }
        history.push("/ReservationPage");// send user and match id to reservation page
        e.preventDefault();
    }
    function handleCancel() {
        if (changed) {
            setChanged(false);
        } else {
            setChanged(true);
        }

    }
    return (
        <div className="MatchesLayout">
            <TopMenu />
            <h2>Matches</h2>
            <div className="AllMatches">{matches.map(mapMatches)}</div>
        </div>
    );
}
export default FanPage;
