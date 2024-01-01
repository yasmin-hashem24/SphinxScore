import React from "react";
import HomePage from "./components/HomePage/HomePage";
import LogInPage from "./components/LogInPage/LogInPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import UserPage from "./components/UserPage/UserPage";
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
          </Switch>
      </BrowserRouter>
  );
}

export default App;
