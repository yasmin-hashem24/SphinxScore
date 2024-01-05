// page to show all matchs
// has a nav bar that goes to My Matches

import React, { useState, useEffect } from "react";
import "./FanPage.css";
import TopMenu from "./TopMenu";
import Button from "@mui/material/Button";
import axios from "axios";
import { useHistory } from 'react-router-dom';
function FanPage() {
    const [reservedMatches, setReservedMatches] = useState([]);
    console.log(reservedMatches)
    const [changed, setChanged] = useState(false);
    const token = localStorage.getItem("token");
    
    const history = useHistory();
    React.useEffect(() => {
        (async () => {
            await axios
                .get("https://localhost:44345/api/Customer/ViewReservedOrNotMatch", {
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
                    {!match.isReserved && (
                        <Button
                            variant="contained"
                            style={{ margin: "4px" }}
                            color="success"
                            data-user-id={match.theMatch._id}
                            onClick={handleReserve}
                        >
                            Reserve
                        </Button>
                    )}
                    {match.isReserved && (
                        <Button
                            variant="contained"
                            style={{ margin: "4px" }}
                            color="error"
                            data-user-id={match.theMatch._id}
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
        history.push(`/ReservePage/${e.target.dataset.userId}`);
        e.preventDefault();
    }
    function handleCancel(e) {
        axios.post(`https://localhost:44345/api/Customer/CancelReservation/${e.target.dataset.userId}`,null, { headers: { Authorization: `bearer ${token}` } })
            .then(response => {
                if (changed) {
                    setChanged(false)
                }
                else {
                    setChanged(true)
                }
            })
            .catch(error => {
                alert("You can not cancel the reservation 3 days befor it.")
            });
    }
    return (
        <div className="MatchesLayout">
            <TopMenu />
            <h2>Matches</h2>
            <div className="AllMatches">{reservedMatches.map(mapMatches)}</div>
        </div>
    );
}
export default FanPage;
