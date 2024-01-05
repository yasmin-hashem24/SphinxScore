import React from "react";
import "./MatchDetailsPage.css";
import { TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Home, LensBlurOutlined } from "@mui/icons-material";





function MatchDetailsPage() {
    const [Date, setDate] = useState(dayjs());
    const [HomeTeam, setHomeTeam] = useState("");
    const [AwayTeam, setAwayTeam] = useState("");
    const [Matchvenue, setMatchvenue] = useState("");
    const [MainRefree, setMainRefree] = useState("");
    const [LineMan1, setLineMan1] = useState("");
    const [LineMan2, setLineMan2] = useState("");

    const [helperHomeTeam, setHelperHomeTeam] = useState("")
    const [helperAwayTeam, setHelperAwayTeam] = useState("")
    const [helperMatchvenue, setHelperMatchvenue] = useState("")
    const [helperMainRefree, setHelperMainRefree] = useState("")
    const [helperLineMan1, setHelperLineMan1] = useState("")
    const [helperLineMan2, setHelperLineMan2] = useState("")
    const [helperDate, setHelperDate] = useState("")

    const [errorHomeTeam, setErrorHomeTeam] = useState(false)
    const [errorAwayTeam, setErrorAwayTeam] = useState(false)
    const [errorMatchvenue, setErrorMatchvenue] = useState(false)
    const [errorMainRefree, setErrorMainRefree] = useState(false)
    const [errorLineMan1, setErrorLineMan1] = useState(false)
    const [errorLineMan2, setErrorLineMan2] = useState(false)
    const [errorDate, setErrorDate] = useState(false)


    const [CreateFlag, setCreateFlag] = useState(true);

    const token = localStorage.getItem("token")


    function CreateMatchData() //post request 
    {
        const regex = /^[a-zA-Z]+[a-zA-Z ]*$/;
        if (HomeTeam === AwayTeam) {
            alert("Please pick different teams")
        }
        if (HomeTeam != "" && AwayTeam != "" && regex.test(Matchvenue) && regex.test(MainRefree) && regex.test(LineMan1) && regex.test(LineMan2) && dayjs(Date).isValid() && HomeTeam != AwayTeam) {

            axios.post('https://localhost:44345/api/manger/CreateMatch',
                {
                    home_team: `${HomeTeam}`,
                    away_team: `${AwayTeam}`,
                    match_venue: `${Matchvenue}`,
                    date_time: `${Date.toISOString().slice(0, -1)}`,
                    main_referee: `${MainRefree}`,
                    linesman1: `${LineMan1}`,
                    linesman2: `${LineMan2}`,
                },
                { headers: { Authorization: `bearer ${token}` } })
                .then(response => {
                    console.log('Post successful:', response.data);
                    alert("Match added successfully")
                })
                .catch(error => {
                    console.log(error);
                    alert("Venue is busy")
                });
        }
        else {
            alert("Please fill with correct info.")
            setCreateFlag(true)
            if (HomeTeam == "") {
                setHelperHomeTeam("HomeTeam can't be empty")
                setErrorHomeTeam(true)

            }
            else {
                setErrorHomeTeam(false)

            }
            if (AwayTeam == "") {
                setHelperAwayTeam("AwayTeam can't be empty")
                setErrorAwayTeam(true)
            }
            else {
                setErrorAwayTeam(false)

            }
            if (HomeTeam == AwayTeam) {
                setErrorHomeTeam(true)
                setErrorAwayTeam(true)
                setHelperHomeTeam("HomeTeam can't be the same as Away Team")
                setHelperHomeTeam("HomeTeam can't be the same as Away Team")
            }
            else {
                setErrorHomeTeam(false)
                setErrorAwayTeam(false)
            }

            if (!regex.test(MainRefree)) {
                setErrorMainRefree(true)
                setHelperMainRefree("Main Refree can't contain special charchters and can't be empty")

            }
            else {
                setErrorMainRefree(false)
            }
            if (!regex.test(LineMan1)) {
                setErrorLineMan1(true)
                setHelperLineMan1("Line Man 1 can't contain special charchters and can't be empty")
            }
            else {
                setErrorLineMan1(false)
            }
            if (!regex.test(LineMan2)) {
                setErrorLineMan2(true)
                setHelperLineMan2("Line Man 2 can't contain special charchters and can't be empty")

            }
            else {
                setErrorLineMan2(false)
            }
            if (!dayjs(Date).isValid()) {
                setErrorDate(true)
                setHelperDate("Date is in invalid format")
            }
            else {
                setErrorDate(false)
            }
        }
    }
    function textFieldChanged(e) {
        if (e.target.id == "MatchVenue_TextField") {
            console.log("entered")
            setMatchvenue(e.target.value)
        }
        else if (e.target.id == "MainRefree_TextField") {
            setMainRefree(e.target.value)
        }
        else if (e.target.id == "LineMan1_TextField") {
            setLineMan1(e.target.value)
        }
        else if (e.target.id == "LineMan2_TextField") {
            setLineMan2(e.target.value)
        }

    }
    function onChangeTeams(e) {
        if (e.target.name == "HomeTeam") {

            setHomeTeam(e.target.value)
        }
        else if (e.target.name == "AwayTeam") {
            setAwayTeam(e.target.value)
        }
    }
    function onchangeDate(e) {
        if (e.target.name == "DateField") {
            setDate(e.target.value)
        }
    }

    const HomeTeamList = ["ahly", "zmalek", "ismalia", "pyramdis", "realmadrid", "barchellona", "elbhren", "Mexican", "ahly", "spain", "egypt", "france", "germany", "amrica", "egypt", "suadi", "katr", "sudan"]
    const AwayTeamList = ["ahly", "zmalek", "ismalia", "pyramdis", "realmadrid", "barchellona", "elbhren", "Mexican", "ahly", "spain", "egypt", "france", "germany", "amrica", "egypt", "suadi", "katr", "sudan"]
    function mapmenuItems(teamno) {
        return <MenuItem key={teamno} value={teamno}>{teamno}</MenuItem>
    }
    return (
        <div className="main_match_layout">
            <div className="match_card">
                <h2 className="Matchheader">Match Details :</h2>
                <div className="inputs">
                    <div className="InputLabels">
                        <InputLabel style={{ color: "#3a4d39", marginBottom: "50%" }}>Home Team</InputLabel>
                        <InputLabel style={{ color: "#3a4d39", marginBottom: "40%" }}>Away Team</InputLabel>
                        <InputLabel style={{ color: "#3a4d39", marginBottom: "50%" }}>Match venue</InputLabel>
                        <InputLabel style={{ color: "#3a4d39", marginBottom: "50%" }}>Match Time</InputLabel>
                        <InputLabel style={{ color: "#3a4d39", marginBottom: "50%" }}>Main Refree</InputLabel>
                        <InputLabel style={{ color: "#3a4d39", marginBottom: "50%" }}>Line Man 1</InputLabel>
                        <InputLabel style={{ color: "#3a4d39", marginBottom: "50%" }}>Line Man 2</InputLabel>
                    </div>

                    <div className="TextFields">
                        <FormControl variant="outlined" color="success" sx={{ marginBottom: "5%", minWidth: 250 }}>
                            <InputLabel>Home Teams</InputLabel>
                            <Select
                                name="HomeTeam"
                                onChange={onChangeTeams}
                                value={HomeTeam}
                                label="Home Team"
                            >
                                {HomeTeamList.map(mapmenuItems)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" color="success" sx={{ marginBottom: "5%", minWidth: 250 }}>
                            <InputLabel>Away Teams</InputLabel>
                            <Select
                                name="AwayTeam"
                                onChange={onChangeTeams}
                                value={AwayTeam}
                                label="Away Team"
                            >
                                {AwayTeamList.map(mapmenuItems)}
                            </Select>
                        </FormControl>

                        <TextField id="MatchVenue_TextField" label="Match venue" variant="outlined" color="success" style={{ marginBottom: "5%", width: "100.2%" }} value={Matchvenue} onChange={textFieldChanged} elperText={helperMatchvenue} error={errorMatchvenue} />
                        <div style={{ marginBottom: "5%" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} color="success" >
                                <DateTimePicker name="DateField" views={['year', 'month', 'day', 'hours', 'minutes']} value={Date} onChange={(e)=>onchangeDate} />
                            </LocalizationProvider>
                        </div>
                        <TextField id="MainRefree_TextField" label="Main Refree" variant="outlined" color="success" style={{ marginBottom: "5%", width: "100.2%" }} value={MainRefree} onChange={textFieldChanged} helperText={helperMainRefree} error={errorMainRefree} />
                        <TextField id="LineMan1_TextField" label="Line Man 1" variant="outlined" color="success" style={{ marginBottom: "5%", width: "100.2%" }} value={LineMan1} onChange={textFieldChanged} />
                        <TextField id="LineMan2_TextField" label="Line Man 2" variant="outlined" color="success" style={{ marginBottom: "0%", width: "100.2%" }} value={LineMan2} onChange={textFieldChanged} helperText={helperLineMan2} error={errorLineMan2} />
                    </div>

                </div>

                <Button variant="outlined" color="success" onClick={CreateMatchData} style={{ marginBottom: "6%", marginTop: "-6%", font: "#ece3ce", overflow: "hidden", marginLeft: "80%", width: "50%" }}> Create </Button>
            </div>
        </div>
    );
}
export default MatchDetailsPage;
