// page to show all matchs
// has a nav bar that goes to My Matches

import React, { useState, useEffect } from "react";
import "./Matches.css";
import TopMenu from "../TopBar/TopMenu";
import Button from "@mui/material/Button";
import axios from "axios";

function UserPage() {
  const [reservedMatches, setReservedMatches] = useState([]);
  React.useEffect(() => {
    (async () => {
      await axios
        .get("https://localhost:44345/api/admin/NonApprovedUsers")
        .then((response) => {
          setReservedMatches(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

  function mapUsers(match) {
    return (
      <div className="MatchLayout" key={user.id}>
        <div className="Containers">
          <div className="Container">
            <label>Home Team:</label>
            <p>{match.home_team}</p>
          </div>
          <div className="Container">
            <label>Away Team:</label>
            <p>{match.away_name}</p>
          </div>
          <div className="Container">
            <label>Match Venue:</label>
            <p>{match.match_venue}</p>
          </div>
          <div className="Container">
            <label>Date:</label>
            <p>{match.date}</p>
          </div>
          <div className="Container">
            <label>Time:</label>
            <p>{match.time}</p>
          </div>
          <div className="Container">
            <label>Main Referee:</label>
            <p>{match.main_referee}</p>
          </div>
          <div className="Container">
            <label>Linesman 1:</label>
            <p>{match.lines_man_1}</p>
          </div>
          <div className="Container">
            <label>Linesman 2:</label>
            <p>{match.lines_man_2}</p>
          </div>
        </div>
        <div className="Buttons">
          {!user.isApproved && (
            <Button
              variant="contained"
              style={{ margin: "4px" }}
              color="success"
              data-user-id={user.id}
              onClick={handleApproval}
            >
              Approve
            </Button>
          )}
          <Button
            variant="contained"
            style={{ margin: "4px" }}
            color="#3A4D39"
            data-user-id={user.id}
            onClick={handleRemoval}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="MatchesLayout">
      <TopMenu />
      <h2>Matches</h2>
      <div className="AllMatches">{reservedMatches.map(mapUsers)}</div>
    </div>
  );
}
export default UserPage;
