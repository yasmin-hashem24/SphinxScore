import React from "react";
import "./TopBar.css";
import { Link } from "react-router-dom";

function TopBar(props) {
    return (
        <div className="TopBar">
      <h2>Welcome to sphinx score</h2>
            {props.user === "guest" ? (
        <div className="NavButtons">
          <Link to="/LogInPage" style={{ margin: '4px'}}>Log in</Link>
          <Link to="/SignUpPage" style={{ margin: '4px' }}>Sign up</Link>
        </div>
      ) : null}
    </div>
    );
}
export default TopBar;