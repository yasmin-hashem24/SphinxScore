import React from "react";
import HomePage from "./components/HomePage/HomePage";
import LogInPage from "./components/LogInPage/LogInPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import UserPage from "./components/UserPage/UserPage";
import ReviewPage from "./components/SignUpPage/ReviewPage"
import AdminPage from "./components/AdminPage/AdminPage";
import GuestPage from "./components/GuestPage/GuestPage";
import FanPage from "./components/FanPage/FanPage"
import "./App.css";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

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
          </Switch>
      </BrowserRouter>
  );
}

export default App;
