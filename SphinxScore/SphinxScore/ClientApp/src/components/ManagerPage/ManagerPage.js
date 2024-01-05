import React, { useState, useEffect } from "react";
import "./ManagerPage.css";
import TopMenu from "./TopMenu";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Reservations() {
    const [matches, setMatches] = useState([]);
    const history = useHistory();
    const { matchId } = useParams();
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
                        <label>Match Venue:</label>
                        <p>{match.match_venue}</p>
                    </div>
                    <div className="Container">
                        <label>Date-Time:</label>
                        <p>{match.date_time}</p>
                    </div>
                    <div className="Container">
                        <label>Main Referee:</label>
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
                <Button
                    variant="contained"
                    style={{ margin: "4px" }}
                    color="success"
                    data-user-id={match._id}
                    onClick={(e) => handleClick(e)}
                >
                    Edit Match
                </Button>
                <Button
                    variant="contained"
                    style={{ margin: "4px" }}
                    color="success"
                    data-user-id={match._id}
                    onClick={(e) => handleReserve(e)}
                >
                    Reservations
                </Button>
            </div>
        );
    }
    function handleClick(e) {
        history.push(`EditMatch/${e.target.dataset.userId}`)
    }
    function handleReserve(e) {
        history.push(`/Reservations/${e.target.dataset.userId}`);
    }
    return (
        <div className="MatchesLayout">
            <TopMenu />
            <h2>Matches</h2>
            <div className="AllMatches">{matches.map(mapMatches)}</div>
        </div>
    );
}
export default Reservations;