import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="HomePageLayout">
      <div className="ImageDiv">
        <img
          src="https://img.freepik.com/free-photo/soccer-into-goal-success-concept_1150-5276.jpg?w=900&t=st=1703290235~exp=1703290835~hmac=2344bdcf95d493a13bf8df23a9b795e33b490f4799614b136f6af19cd63d76c7"
          alt="Landing Page"
        />
      </div>
      <div className="ActionsDiv">
        <div className="ActionsCard">
          <h2>Welcome to Sphinx Score</h2>
          <div className="ButtonsDiv">
            <Link to="/SignUpPage">
              <button>Sign up</button>
            </Link>
            <Link to="/LogInPage">
              <button>Log in</button>
             </Link>
            <Link to="/GuestPage">
                <button>View Matches</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
