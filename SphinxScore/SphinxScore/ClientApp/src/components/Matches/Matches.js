// page to show all matchs
// has a nav bar that goes to My Matches

import React, { useState, useEffect } from "react";
import "./Matches.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import TopMenu from "../TopBar/TopMenu";

function Matches() {
  return (
    <div className="AdminPageLayout">
      <TopMenu />
      <h2>Matches</h2>
      <div className="AllMatches">
        <div className="MatchLayout">
          <div className="Containers">
            <div className="Container">
              <p>Home Team VS. Away Team</p>
            </div>
            <div className="Container">
              <label> At:</label>
              <p>Match Venues</p>
            </div>
            <div className="Container">
              <label>Date:</label>
              <p>Date</p>
            </div>
            <div className="Container">
              <label>Time:</label>
              <p>time</p>
            </div>
          </div>
          <div className="Buttons">
            <Button
              variant="contained"
              style={{ margin: "4px" }}
              color="success"
            >
              Reserve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Matches;
