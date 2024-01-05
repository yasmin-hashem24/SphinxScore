import React, { useState } from "react";
import "./AddStadium.css"; 
import { TextField } from "@mui/material";
import { useHistory } from 'react-router-dom';
import axios from "axios";

function AddStadiumPage() {
    const token = localStorage.getItem("token");
    const history = useHistory();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [rows, setRows] = useState(1);
    const [seatsPerRow, setSeatsPerRow] = useState(1);
  

    const [helperName, setHelperName] = useState("");
    const [helperLocation, setHelperLocation] = useState("");

    const [errorName, setErrorName] = useState(false);
    const [errorLocation, setErrorLocation] = useState(false);

    function handleSubmission(e) {
        const trimmedName = name.trimEnd().trimStart();
        const trimmedLocation = location.trimEnd().trimStart();

        if (trimmedName === "") {
            setHelperName("Please enter the stadium name.");
            setErrorName(true);
            setHelperLocation("");
            setErrorLocation(false);
            e.preventDefault();
            return false;
        } else if (trimmedLocation === "") {
            setHelperLocation("Please enter the stadium location.");
            setErrorLocation(true);
            setHelperName("");
            setErrorName(false);
            e.preventDefault();
            return false;
        } else {
            axios
                .post("https://localhost:44345/api/manger/AddStadium", {
                    name: `${trimmedName}`,
                    location: `${trimmedLocation}`,
                    rows: rows,
                    seats_per_row: seatsPerRow,
                    IsReserved: false
                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                .then((response) => {
                    // Handle the response if needed
                    alert("Stadium added successfully")
                })
                .catch((error) => {
                    console.log(error);
                    alert("Please enter another stadium name")
                });
        }


        e.preventDefault();
    }

    return (
        <div className="SignUpLayout">
            <div className="SignUpCard">
                <form onSubmit={handleSubmission}>
                    <h2>Add Stadium</h2>
                    <TextField
                        label="Stadium Name"
                        variant="outlined"
                        color="success"
                        style={{ marginBottom: "10px", width: "100%" }}
                        onChange={(e) => setName(e.target.value)}
                        error={errorName}
                        helperText={helperName}
                    />
                    <TextField
                        label="Stadium Location"
                        variant="outlined"
                        color="success"
                        style={{ marginBottom: "10px", width: "100%" }}
                        onChange={(e) => setLocation(e.target.value)}
                        error={errorLocation}
                        helperText={helperLocation}
                    />
                    <TextField
                        label="Rows"
                        variant="outlined"
                        color="success"
                        style={{ marginBottom: "10px", width: "100%" }}
                        type="number"
                        value={rows}
                        inputProps={{ min: 1 }}
                        onChange={(e) => setRows(parseInt(e.target.value, 10))}
                    />
                    <TextField
                        label="Seats Per Row"
                        variant="outlined"
                        color="success"
                        style={{ marginBottom: "10px", width: "100%" }}
                        type="number"
                        value={seatsPerRow}
                        inputProps={{ min: 1 }}
                        onChange={(e) => setSeatsPerRow(parseInt(e.target.value, 10))}
                    />
             
                    <button>Add Stadium</button>
                </form>
            </div>
        </div>
    );
}

export default AddStadiumPage;
