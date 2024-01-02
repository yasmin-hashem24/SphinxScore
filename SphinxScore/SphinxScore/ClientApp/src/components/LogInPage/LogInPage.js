import React, { useState } from "react";
import "./LogInPage.css";
import axios from "axios";
import { TextField } from "@mui/material";
import { useHistory } from 'react-router-dom';

function LogInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [helperUsername, setHelperUsername] = useState("");
  const [helperPassword, setHelperPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  //const navigation = useNavigate();
  const history = useHistory();

  function HandleSubmission(e) {
    const trimmedUsername = username.trimEnd().trimStart();
    const trimmedPassword = password.trimEnd().trimStart();
      if (trimmedUsername === "") {
          setHelperUsername("Please enter your username.");
          setErrorUsername(true);
          setHelperPassword("");
          setErrorPassword(false);
          e.preventDefault();
          return false;
      } else if (trimmedPassword === "") {
          setHelperPassword("Please enter your password.");
          setErrorPassword(true);
          setHelperUsername("");
          setErrorUsername(false);
          e.preventDefault();
          return false;
      }
      else {
          axios
              .post("https://localhost:44345/api/account/login", {
                  username: `${trimmedUsername}`,
                  password: `${trimmedPassword}`
              })
              .then((response) => {
                  console.log(response['data'])
                  if (!response['data']['user']['isApproved']) {
                      setHelperUsername("User is not approved");
                      setErrorUsername(true);
                  }
                  else {
                      if (response['data']['user']['role'] === 'fan') {
                          localStorage.setItem("token", response['data']['token']);
                          history.push("/UserPage");
                      }   
                      else if (response['data']['user']['role'] === 'admin') {
                          localStorage.setItem("token", response['data']['token']);
                          history.push("/AdminPage");
                      } 
                  }
              })
              .catch((error) => {
                  console.log(error);
                  setHelperUsername("Incorrect username or password");
                  setErrorUsername(true);
              });
          e.preventDefault();
      }
  }

  return (
    <div className="LogInLayout">
      <div className="LogInCard">
        <form onSubmit={HandleSubmission}>
          <h2>Log in</h2>
          <TextField
            label="username"
            variant="outlined"
            color="success"
            style={{ marginBottom: "10px", width: "100%" }}
            onChange={(e) => setUsername(e.target.value)}
            error={errorUsername}
            helperText={helperUsername}
          />
          <TextField
            label="password"
            type="password"
            variant="outlined"
            color="success"
            style={{ marginBottom: "10px", width: "100%" }}
            onChange={(e) => setPassword(e.target.value)}
            error={errorPassword}
            helperText={helperPassword}
                  />
           <button type = 'submit'>Log in</button>
        </form>
      </div>
    </div>
  );
}
export default LogInPage;
