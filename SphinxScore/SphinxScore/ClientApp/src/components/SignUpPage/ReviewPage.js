import React from "react";
import { Link } from 'react-router-dom';
import "./ReviewPage.css";

function LogInPage() {

    return (
        <div className="ReviewLayout">
            <div className="ReviewCard">
                <h2>Your account is currently being reviewed <br /> click <Link to="/">here</Link> to go to home page</h2>
            </div>
        </div>
    );
}
export default LogInPage;