import React, { useState } from "react";
import "./EditProfile.css";
import { TextField } from "@mui/material";
import { useHistory } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

const cities = [
  "Cairo",
  "Alexandria",
  "Gizeh",
  "Shubra El-Kheima",
  "Port Said",
  "Suez",
  "Luxor",
  "al-Mansura",
  "El-Mahalla El-Kubra",
  "Tanta",
  "Asyut",
  "Ismailia",
  "Fayyum",
  "Zagazig",
  "Aswan",
  "Damietta",
  "Damanhur",
  "al-Minya",
  "Beni Suef",
  "Qena",
  "Sohag",
  "Hurghada",
  "6th of October City",
  "Shibin El Kom",
  "Banha",
  "Kafr el-Sheikh",
  "Arish",
  "Mallawi",
  "10th of Ramadan City",
  "Bilbais",
  "Marsa Matruh",
  "Idfu",
  "Mit Ghamr",
  "Al-Hamidiyya",
  "Desouk",
  "Qalyub",
  "Abu Kabir",
  "Kafr el-Dawwar",
  "Girga",
  "Akhmim",
  "Matareya",
];

function EditProfile() {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState(dayjs());
  const [gender, setGender] = useState("male");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("fan");

  const [helperUsername, setHelperUsername] = useState("");
  const [helperPassword, setHelperPassword] = useState("");
  const [helperFirstName, setHelperFirstName] = useState("");
  const [helperLastName, setHelperLastName] = useState("");
  const [helperCity, setHelperCity] = useState("");
  const [helperEmail, setHelperEmail] = useState("");

  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorCity, setErrorCity] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);

  function HandleSubmission(e) {
    const trimmedUsername = username.trimEnd().trimStart();
    const trimmedPassword = password.trimEnd().trimStart();
    const trimmedFirstName = firstName.trimEnd().trimStart();
    const trimmedLastName = lastName.trimEnd().trimStart();
    const trimmedEmail = email.trimEnd().trimStart();

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
    } else if (trimmedFirstName === "") {
      setHelperFirstName("please enter your first name.");
      setErrorFirstName(true);
      setHelperPassword("");
      setErrorPassword(false);
      setHelperUsername("");
      setErrorUsername(false);
      e.preventDefault();
      return false;
    } else if (trimmedLastName === "") {
      setHelperLastName("please enter your Last name.");
      setErrorLastName(true);
      setHelperFirstName("");
      setErrorFirstName(false);
      setHelperPassword("");
      setErrorPassword(false);
      setHelperUsername("");
      setErrorUsername(false);
      e.preventDefault();
      return false;
    } else if (city === "") {
      setHelperCity("Please enter city.");
      setErrorCity(true);
      setHelperLastName("");
      setErrorLastName(false);
      setHelperFirstName("");
      setErrorFirstName(false);
      setHelperPassword("");
      setErrorPassword(false);
      setHelperUsername("");
      setErrorUsername(false);
      e.preventDefault();
      return false;
    } else if (trimmedEmail === "") {
      setHelperEmail("Please enter email.");
      setErrorEmail(true);
      setHelperCity("");
      setErrorCity(false);
      setHelperLastName("");
      setErrorLastName(false);
      setHelperFirstName("");
      setErrorFirstName(false);
      setHelperPassword("");
      setErrorPassword(false);
      setHelperUsername("");
      setErrorUsername(false);
      e.preventDefault();
      return false;
    } else {
      const newDate =
        date.format("YYYY") + "-" + date.format("MM") + "-" + date.format("DD");
      axios
        .post("https://localhost:44345/api/account/SignUp", {
          username: `${trimmedUsername}`,
          password: `${trimmedPassword}`,
          first_name: `${trimmedFirstName}`,
          last_name: `${trimmedLastName}`,
          birth_date: `${newDate}`, // Use an actual date in ISO format
          gender: `${gender}`,
          city: `${city}`,
          address: `${address}`,
          email_address: `${trimmedEmail}`,
          role: `${role}`,
        })
        .then((response) => {
          history.push("/ReviewPage");
        })
        .catch((error) => {
          console.log(error);
          setHelperUsername("Username taken. Please pick another username.");
          setErrorUsername(true);
        });
    }
    e.preventDefault();
  }

  function mapCities(city) {
    return (
      <MenuItem key={city} value={city}>
        {city}
      </MenuItem>
    );
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: "#2e7d32",
      },
    },
  });

  return (
    <div className="SignUpLayout">
      <div className="SignUpCard">
        <form onSubmit={HandleSubmission}>
          <h2>Sign up</h2>
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
          <TextField
            label="First Name"
            variant="outlined"
            color="success"
            style={{ marginBottom: "10px", width: "100%" }}
            onChange={(e) => setFirstName(e.target.value)}
            error={errorFirstName}
            helperText={helperFirstName}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            color="success"
            style={{ marginBottom: "10px", width: "100%" }}
            onChange={(e) => setLastName(e.target.value)}
            error={errorLastName}
            helperText={helperLastName}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
              <DatePicker
                color="primary"
                maxDate={dayjs()}
                label="Select Date"
                value={date}
                onChange={(date) => setDate(date)}
              />
            </ThemeProvider>
          </LocalizationProvider>
          <div className="radioArea">
            <label>Gender</label>
            <RadioGroup
              row
              onChange={(e) => setGender(e.target.value)}
              defaultValue="male"
            >
              <FormControlLabel
                value="male"
                control={<Radio color="success" />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio color="success" />}
                label="Female"
              />
            </RadioGroup>
          </div>
          <TextField
            select
            label="City"
            onChange={(e) => setCity(e.target.value)}
            color="success"
            variant="outlined"
            style={{ marginBottom: "10px", width: "100%" }}
            error={errorCity}
            helperText={helperCity}
            defaultValue=""
          >
            {cities.map(mapCities)}
          </TextField>
          <TextField
            label="Address(optional)"
            variant="outlined"
            color="success"
            style={{ marginBottom: "10px", width: "100%" }}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            color="success"
            style={{ marginBottom: "10px", width: "100%" }}
            onChange={(e) => setEmail(e.target.value)}
            error={errorEmail}
            helperText={helperEmail}
          />
          <div className="radioArea">
            <label>Role</label>
            <RadioGroup
              row
              onChange={(e) => setRole(e.target.value)}
              defaultValue="fan"
            >
              <FormControlLabel
                value="fan"
                control={<Radio color="success" />}
                label="Fan"
              />
              <FormControlLabel
                value="manager"
                control={<Radio color="success" />}
                label="Manager"
              />
            </RadioGroup>
          </div>
          <button>Sign up</button>
        </form>
      </div>
    </div>
  );
}
export default EditProfile;
