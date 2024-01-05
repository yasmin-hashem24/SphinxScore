import React from "react";
import "./EditMatch.css";
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
import {MenuItem} from '@mui/material';
import {FormControl} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';






function EditMatch() {
    const [Date, setDate] = useState(dayjs());
    const [HomeTeam, setHomeTeam] = useState("");
    const [AwayTeam, setAwayTeam] = useState("");
    const [Matchvenue, setMatchvenue] = useState("");
    const [MainRefree, setMainRefree] = useState("");
    const [LineMan1, setLineMan1] = useState("");
    const [LineMan2, setLineMan2] = useState("");


    const [helperHomeTeam,setHelperHomeTeam] = useState("")
    const [helperAwayTeam,setHelperAwayTeam] = useState("")
    const [helperMatchvenue,setHelperMatchvenue] = useState("")
    const [helperMainRefree,setHelperMainRefree] = useState("")
    const [helperLineMan1,setHelperLineMan1] = useState("")
    const [helperLineMan2,setHelperLineMan2] = useState("")
    const [helperDate,setHelperDate] = useState("")

    const [errorHomeTeam,setErrorHomeTeam] = useState(false)
    const [errorAwayTeam,setErrorAwayTeam] = useState(false)
    const [errorMatchvenue,setErrorMatchvenue] = useState(false)
    const [errorMainRefree,setErrorMainRefree] = useState(false)
    const [errorLineMan1,setErrorLineMan1] = useState(false)
    const [errorLineMan2,setErrorLineMan2] = useState(false)
    const [errorDate,setErrorDate] = useState(false)

    const [EditFlagHomeTeam, setEditFlagHomeTeam] = useState(true);
    const [EditFlagAwayTeam, setEditFlagAwayTeam] = useState(true);
    const [EditFlagMatchvenue, setEditFlagMatchvenue] = useState(true);
    const [EditFlagMainRefree, setEditFlagMainRefree] = useState(true);
    const [EditFlagLineMan1, setEditFlagLineMan1] = useState(true);
    const [EditFlagLineMan2, setEditFlagLineMan2] = useState(true);
    const [EditFlagMatchTime, setEditFlagMatchTime] = useState(true);
    const [SaveFlag,setSaveFlag]=useState(true);

    const { matchId } = useParams();
    const token = localStorage.getItem("token")


    function SaveMatchData() //post request 
    {
        console.log("entered")
        const regex = /^[a-zA-Z]+[a-zA-Z ]*$/ ;
        console.log(regex.test(Matchvenue))
        console.log(regex.test(MainRefree))
        console.log(regex.test(LineMan1))
        console.log(regex.test(LineMan2))
        console.log(dayjs(Date).isValid())
        if(regex.test(Matchvenue) && regex.test(MainRefree) && regex.test(LineMan1) && regex.test(LineMan2) && dayjs(Date).isValid())
        {

            console.log(token)
            axios.patch(`https://localhost:44345/api/manger/UpdateMatch/${matchId}`, 
            {
            home_team: `${HomeTeam}`,
            away_team: `${AwayTeam}`,
            match_venue: `${Matchvenue}`,
            date_time: `${Date.toISOString().slice(0, -1)}`,
            main_referee: `${MainRefree}`, // Use an actual date in ISO format
            linesman1: `${LineMan1}`,
            linesman2: `${LineMan2}`,
            }
            , { headers: { Authorization: `bearer ${token}` } })
                .then(response => {
                    console.log('Patch successful:', response.data);
                })
                .catch(error => {
                });
        }
        else
        {
            setSaveFlag(true)
            if(!regex.test(Matchvenue))
            {
                setErrorMatchvenue(true)
                setHelperMatchvenue("Match venue must can't contain special charchters and can't be empty")

            }
            else{
                setErrorMatchvenue(false)
            }
            if(!regex.test(MainRefree))
            {
                setErrorMainRefree(false)
                setHelperMainRefree("Main Refree must can't contain special charchters and can't be empty")

            }
            if(!regex.test(LineMan1))
            {
                setErrorLineMan1(false)
                setHelperLineMan1("Line Man 1 must can't contain special charchters and can't be empty")

            }
            if(!regex.test(LineMan2))
            {
                setErrorLineMan2(false)
                setHelperLineMan2("Line Man 2 must can't contain special charchters and can't be empty")

            }
            if(!dayjs(Date).isValid())
            {
                setErrorDate(false)
                setHelperDate("Date is in invalid format")
            }
        }
        alert("The match has been updated")
    }
    function textFieldChanged(e)
    {
        
        if(e.target.id=="MatchVenue_TextField")
        {
            console.log("entred")
            setMatchvenue(e.target.value)
            setSaveFlag(false)
        }
        else if(e.target.id=="MainRefree_TextField")
        {
            setMainRefree(e.target.value)
            setSaveFlag(false)
        }
        else if(e.target.id=="LineMan1_TextField")
        {
            setLineMan1(e.target.value)
            setSaveFlag(false)
        }
        else if(e.target.id=="LineMan2_TextField")
        {
            setLineMan2(e.target.value)
            setSaveFlag(false)
        }
        
    }
    function onChangeTeams(e)
    {
        if(e.target.name=="HomeTeam")
        {
            
            setHomeTeam(e.target.value)
            setSaveFlag(false)
        }
        else if(e.target.name=="AwayTeam")
        {
            setAwayTeam(e.target.value)
            setSaveFlag(false)
        }
    }
    function onchangeDate(e)
    {
        if(e.target.name=="DateField")
        {
            setDate(e.target.value)
            setSaveFlag(false)
        }
    }
   React.useEffect(() => {
            (async () => {
                await axios
                    .get(`https://localhost:44345/api/account/viewMatch/${matchId}`, { headers: { Authorization: `bearer ${token}` } })
                    .then((response) => {
                        setHomeTeam(response.data.home_team)
                        setAwayTeam(response.data.away_team)
                        setMainRefree(response.data.main_referee)
                        setMatchvenue(response.data.match_venue)
                        setLineMan1(response.data.linesman1)
                        setLineMan2(response.data.linesman2)
                        setDate(dayjs(response.data.date_time))
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })();
        }, []);

    const HomeTeamList=["ahly","zmalek","ismalia","pyramdis","realmadrid","barchellona","elbhren","Mexican","ahly","spain","egypt","france","germany","amrica","egypt","suadi","katr","sudan"]    
    const AwayTeamList=["ahly","zmalek","ismalia","pyramdis","realmadrid","barchellona","elbhren","Mexican","ahly","spain","egypt","france","germany","amrica","egypt","suadi","katr","sudan"]    
    
    function mapmenuItems(teamno)
    {
        return <MenuItem key={teamno} value={teamno}>{teamno}</MenuItem>
    }

    return (
        <div className="main_match_layout">
            <div className="match_card">
                <h2 className="Matchheader">Match Details :</h2>
                <div className="inputs">
                    <div className="InputLabels">
                        <InputLabel style={{color: "#3a4d39",marginBottom:"50%"}}>Home Team</InputLabel>
                        <InputLabel style={{color: "#3a4d39",marginBottom:"40%"}}>Away Team</InputLabel>
                        <InputLabel style={{color: "#3a4d39",marginBottom:"50%"}}>Match venue</InputLabel>
                        <InputLabel style={{color: "#3a4d39",marginBottom:"50%"}}>Match Time</InputLabel>
                        <InputLabel style={{color: "#3a4d39",marginBottom:"50%"}}>Main Refree</InputLabel>
                        <InputLabel style={{color: "#3a4d39",marginBottom:"50%"}}>Line Man 1</InputLabel>
                        <InputLabel style={{color: "#3a4d39",marginBottom:"50%"}}>Line Man 2</InputLabel>
                    </div>
                    
                    <div className="TextFields">
                        <FormControl variant="outlined"color="success" sx={{ marginBottom:"5%",minWidth: 250 }}>
                            <InputLabel>Home Teams</InputLabel>
                            <Select
                            disabled={EditFlagHomeTeam}
                            name="HomeTeam"
                            onChange={onChangeTeams}
                            value={HomeTeam}
                            label="Home Team"

                            >
                                
                            {HomeTeamList.map(mapmenuItems)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined"color="success" sx={{ marginBottom:"5%",minWidth: 250 }}>
                            <InputLabel>Away Teams</InputLabel>
                            <Select
                            name="AwayTeam"
                            disabled={EditFlagAwayTeam}
                            onChange={onChangeTeams}
                            value={AwayTeam}
                            label="Away Team"

                            >
                            {AwayTeamList.map(mapmenuItems)}
                            </Select>
                        </FormControl>
                        
                        <TextField id="MatchVenue_TextField" label="Match venue" disabled={EditFlagMatchvenue} variant="outlined" color="success" style={{marginBottom:"5%",width:"100.2%"}} value={Matchvenue} onChange={textFieldChanged} helperText={helperMatchvenue} error={errorMatchvenue}/>
                        <div style={{marginBottom:"5%"}}  >
           
                            <LocalizationProvider dateAdapter={AdapterDayjs} color="success" >
                                <DateTimePicker  name = "DateField"  views={['year', 'month', 'day','hours','minutes']} disabled={EditFlagMatchTime} value={Date} onChange={onchangeDate}/>
                            </LocalizationProvider>
                        </div>
                        <TextField id="MainRefree_TextField" label="Main Refree" disabled={EditFlagMainRefree} variant="outlined" color="success" style={{marginBottom:"5%",width:"100.2%"}} value={MainRefree} onChange={textFieldChanged} helperText={helperMainRefree} error={errorMainRefree}/>
                        <TextField id="LineMan1_TextField" label="Line Man 1" disabled={EditFlagLineMan1} variant="outlined" 
                        helperText={helperLineMan1}
                        error={errorLineMan1}
                        color="success" style={{marginBottom:"5%",width:"100.2%"}} value={LineMan1} onChange={textFieldChanged}/>
                        <TextField id="LineMan2_TextField" label="Line Man 2" disabled={EditFlagLineMan2} variant="outlined" 
                        helperText={helperLineMan2}
                        error={errorLineMan2}
                        color="success" style={{marginBottom:"0%",width:"100.2%"}} value={LineMan2} onChange={textFieldChanged}/>
                    </div>


                    <div className="ModeEditOutlinedIcon">
                        <ModeEditOutlinedIcon className="editHomeTeam" color="success" style={{marginTop: "50%"}}  
                        onClick={e=> setEditFlagHomeTeam(false) } 
                        />
                        <ModeEditOutlinedIcon className="editAwayTeam" color="success" style={{marginTop: "180%",}}  onClick={e=> setEditFlagAwayTeam(false) } />
                        <ModeEditOutlinedIcon className="editMatchVenue"  color="success" style={{marginTop: "180%",}} onClick={e=> setEditFlagMatchvenue(false) } />
                        <ModeEditOutlinedIcon className="editMatchTime"  color="success" style={{marginTop: "200%",}} onClick={e=> setEditFlagMatchTime(false) }/>
                        <ModeEditOutlinedIcon className="editMainRefree" color="success" style={{marginTop: "180%",}} onClick={e=> setEditFlagMainRefree(false) }/>
                        <ModeEditOutlinedIcon className="editLineMan1" color="success" style={{marginTop: "200%",}} onClick={e=> setEditFlagLineMan1(false) }/>
                        <ModeEditOutlinedIcon className="editLineMan2" color="success" style={{marginTop: "180%",}} onClick={e=> setEditFlagLineMan2(false) }/>
                    </div>
                </div>

                <Button variant="outlined" disabled={SaveFlag} color="success" onClick={SaveMatchData} style={{marginBottom:"6%",marginTop:"-6%",font:"#ece3ce",overflow:"hidden",marginLeft:"80%",width:"50%"}}> Save </Button>
            </div>    
        </div>
    );
}
export default EditMatch;
