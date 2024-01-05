import React from "react";
import HomePage from "./components/HomePage/HomePage";
import LogInPage from "./components/LogInPage/LogInPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import UserPage from "./components/UserPage/UserPage";
import ReviewPage from "./components/SignUpPage/ReviewPage"
import AdminPage from "./components/AdminPage/AdminPage";
import GuestPage from "./components/GuestPage/GuestPage";
import AddStadiumPage from "./components/AddStadium/AddStadium";
import FanPage from "./components/FanPage/FanPage"
import "./App.css";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import ManagerPage from "./components/ManagerPage/ManagerPage";
import EditMatch from "./components/EditMatch/EditMatch"
import MatchDetailsPage from "./components/MatchDetailsPage/MatchDetailsPage"
import Reservations from "./components/Reservations/Reservations"
import EditUser from "./components/FanPage/EditUser"

function App() {
  return (
      <BrowserRouter>
          <Switch>
            <Route path="/" exact component={ HomePage } />
            <Route path="/LogInPage" component={ LogInPage } />
            <Route path="/SignUpPage" component={SignUpPage} />
             <Route path="/UserPage" component={UserPage} />
              <Route path="/ReviewPage" component={ReviewPage} />
              <Route path="/AdminPage" component={AdminPage} />
              <Route path="/GuestPage" component={GuestPage} />
              <Route path="/FanPage" component={FanPage} />
              <Route path="/AddStadiumPage" component={AddStadiumPage} />
              <Route path="/ReservePage/:matchId" component={UserPage} />
              <Route path="/ManagerPage/" component={ManagerPage} />
              <Route path="/EditMatch/:matchId" component={EditMatch} />
              <Route path="/CreateMatch" component={MatchDetailsPage} />
              <Route path="/AddStadium" component={AddStadiumPage} />
              <Route path="/Reservations/:matchId" component={Reservations} />
              <Route path="/EditUser" component={EditUser} />
          </Switch>
      </BrowserRouter>
  );
}

export default App;
