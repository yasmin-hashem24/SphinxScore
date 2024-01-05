import React from "react";
import "./EditUser.css";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { DatePicker } from "@mui/x-date-pickers-pro";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function EditUser() {
  const [password, setpassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [city, setcity] = useState("");
  const [address, setaddress] = useState("");

  const [helperpassword, setHelperpassword] = useState("");
  const [helperfirstName, setHelperfirstName] = useState("");
  const [helperlastName, setHelperlastName] = useState("");
  const [helpercity, setHelpercity] = useState("");
  const [helperaddress, setHelperaddress] = useState("");

  const [errorpassword, setErrorpassword] = useState(false);
  const [errorfirstName, setErrorfirstName] = useState(false);
  const [errorlastName, setErrorLastName] = useState(false);
  const [errorcity, setErrorcity] = useState(false);
  const [erroraddress, setErroraddress] = useState(false);


  const [EditFlagpassword, setEditFlagpassword] = useState(true);
  const [EditFlagfirstName, setEditFlagfirstName] = useState(true);
  const [EditFlaglastName, setEditFlagLastName] = useState(true);
  const [EditFlagcity, setEditFlagcity] = useState(true);
  const [EditFlagaddress, setEditFlagaddress] = useState(true);

  const [SaveFlag, setSaveFlag] = useState(true);

  const token = localStorage.getItem("token");

  function SaveMatchData() {
    //post request
    const regex = /^[a-zA-Z]+[a-zA-Z ]*$/;
    // regex to allow allow for letteres and numbers only
    const regex2 = /^[a-zA-Z0-9]+[a-zA-Z0-9 ]*$/;

    if (
      regex.test(firstName) &&
      regex.test(lastName) &&
      regex2.test(address) 
    ) {
      axios
        .patch(
          `https://localhost:44345/api/Customer/EditUser`,
          {
            password:` ${password}`,
            first_name: `${firstName}`,
            last_name: `${lastName}`,
            city: `${city}`, // Use an actual date in ISO format
            address: `${address}`,
          },
          { headers: { Authorization: `bearer ${token}` } }
        )
        .then((response) => {
          console.log("Patch successful:", response.data);
        })
        .catch((error) => {});
    } 
    
    
    else {
      setSaveFlag(true);

      if (!regex.test(firstName) && firstName=="") {
        setErrorfirstName(true);
        setHelperfirstName(
          "First Name can't contain special charchters and can't be empty"
        );
      }
      else
      {
        setErrorfirstName(false);
      }
      if (!regex.test(lastName)&& lastName=="") {
        setErrorLastName(true);
        setHelperlastName(
          "Last Name can't contain special charchters and can't be empty"
        );
      }
      else
      {
        setErrorLastName(false);
      }
      if (address=="") {
        setErroraddress(true);
        setHelperaddress(
          "Address can't be empty"
        );
      }
      else
      {
        setErroraddress(false);
      }

    }
  }
  function textFieldChanged(e) {
    if (e.target.id == "Password_TextField") {
      setpassword(e.target.value);
      setSaveFlag(false);
    } else if (e.target.id == "FirstName_TextField") {
      setfirstName(e.target.value);
      setSaveFlag(false);
    } else if (e.target.id == "LastName_TextField") {
      setlastName(e.target.value);
      setSaveFlag(false);
    } else if (e.target.id == "Address_TextField") {
      setaddress(e.target.value);
      setSaveFlag(false);
    }
  }
  function onChangeTeams(e) {
    if (e.target.name == "city") {
      setcity(e.target.value);
      setSaveFlag(false);
    }
  }
  console.log(token)

  React.useEffect(() => {
    (async () => {
        
      await axios
        .get(`https://localhost:44345/api/customer/ViewUser`, {
          headers : { Authorization: `bearer ${token} ` }
        })
        .then((response) => {
          setpassword(response.data.password)
          setfirstName(response.data.first_name)
          setlastName(response.data.last_name)
          setcity(response.data.city)
          setaddress(response.data.address)
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

  const citylist = [
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

  function mapmenuItems(city) {
    return (
      <MenuItem key={city} value={city}>
        {city}
      </MenuItem>
    );
  }

  return (
    <div className="main_match_layout">
      <div className="match_card">
        <h2 className="Matchheader">User Details :</h2>
        <div className="inputs">
          <div className="InputLabels">
            <InputLabel style={{ color: "#3a4d39", marginBottom: "50%" }}>
              First Name
            </InputLabel>
            <InputLabel style={{ color: "#3a4d39", marginBottom: "40%" }}>
              Last Name
            </InputLabel>
            <InputLabel style={{ color: "#3a4d39", marginTop: "20%" }}>
              City
            </InputLabel>
            <InputLabel style={{ color: "#3a4d39", marginTop: "60%" }}>
              Password
            </InputLabel>
            <InputLabel style={{ color: "#3a4d39", marginTop: "50%" }}>
              Address
            </InputLabel>
          </div>

          <div className="TextFields">
            <TextField
              id="FirstName_TextField"
              label="First Name"
              disabled={EditFlagfirstName}
              variant="outlined"
              color="success"
              style={{ marginBottom: "5%", width: "100.2%" }}
              value={firstName}
              onChange={textFieldChanged}
              helperText={helperfirstName}
              error={errorfirstName}
            />

            <TextField
              id="LastName_TextField"
              label="Last Name"
              disabled={EditFlaglastName}
              variant="outlined"
              color="success"
              style={{ marginBottom: "5%", width: "100.2%" }}
              value={lastName}
              onChange={textFieldChanged}
              helperText={helperlastName}
              error={errorlastName}
            />

            <FormControl
              variant="outlined"
              color="success"
              sx={{ marginBottom: "5%", minWidth: 250 }}
            >
              <InputLabel>City</InputLabel>
              <Select
                disabled={EditFlagcity}
                name="City"
                onChange={onChangeTeams}
                value={city}
                label="City"
                helperText={helpercity}
                error={errorcity}
              >
                {citylist.map(mapmenuItems)}
              </Select>
            </FormControl>

            <TextField
              id="Password_TextField"
              label="Password"
              disabled={EditFlagpassword}
              variant="outlined"
              color="success"
              style={{ marginBottom: "5%", width: "100.2%" }}
              value={password}
              onChange={textFieldChanged}
              helperText={helperpassword}
              error={errorpassword}
            />

            <TextField
              id="Address_TextField"
              label="Address"
              disabled={EditFlagaddress}
              variant="outlined"
              color="success"
              style={{ marginBottom: "5%", width: "100.2%" }}
              value={address}
              onChange={textFieldChanged}
              helperText={helperaddress}
              error={erroraddress}
            />
          </div>

          <div className="ModeEditOutlinedIcon">
            <ModeEditOutlinedIcon
              className="editfirstName"
              color="success"
              style={{ marginTop: "60%" }}
              onClick={(e) => setEditFlagfirstName(false)}
            />
            <ModeEditOutlinedIcon
              className="editLastName"
              color="success"
              style={{ marginTop: "160%" }}
              onClick={(e) => setEditFlagLastName(false)}
            />
             <ModeEditOutlinedIcon
              className="editcity"
              color="success"
              style={{ marginTop: "170%" }}
              onClick={(e) => setEditFlagcity(false)}
            />
            <ModeEditOutlinedIcon
              className="editpassword"
              color="success"
              style={{ marginTop: "200%" }}
              onClick={(e) => setEditFlagpassword(false)}
            />

            <ModeEditOutlinedIcon
              className="editaddress"
              color="success"
              style={{ marginTop: "180%" }}
              onClick={(e) => setEditFlagaddress(false)}
            />
          </div>
        </div>

        <Button
          variant="outlined"
          disabled={SaveFlag}
          color="success"
          onClick={SaveMatchData}
          style={{
            marginBottom: "6%",
            marginTop: "-6%",
            font: "#ece3ce",
            overflow: "hidden",
            marginLeft: "80%",
            width: "50%",
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
export default EditUser;