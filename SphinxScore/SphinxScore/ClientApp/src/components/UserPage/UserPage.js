import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import "./UserPage.css";
import NewButton from "./newButton"
import TextField from '@mui/material/TextField';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';


function UserPage() {
    let rowNum = -1;
    let seatNum = -1
    const [seats, setSeats] = useState({"seats":[]})
    const [reservedSeats, setReservedSeats] = useState([]);
    const [cardNumber, setCardNumber] = useState("");
    const [pinNumber, setPinNumber] = useState("");

    const [helperCredit, setHelperCredit] = useState("");
    const [helperPin, setHelperPin] = useState("");
    const [errorCredit, setErrorCredit] = useState(false);
    const [errorPin, setErrorPin] = useState(false);
    const { matchId } = useParams();
    const token = localStorage.getItem("token")
    const history = useHistory();

    const handleClick = (e) => {
        let currentSeats = reservedSeats;
        for (let i = 0; i < currentSeats.length; i++) {
            if (currentSeats[i]['row'] === e.target.dataset.userRow && currentSeats[i]['seat_num'] === e.target.dataset.userSeat) {
                currentSeats.splice(i, 1);
                console.log(currentSeats)
                return;
            }
        }
        currentSeats.push({
            'row': e.target.dataset.userRow,
            'seat_num': e.target.dataset.userSeat,
        })
        setReservedSeats(currentSeats)
        console.log(currentSeats)
    };
    function mapSeats(seat, index) {        
        seatNum += 1
        return (
            <NewButton seatNum={seatNum} handleClick={handleClick} seat={seat} indexNum={index} rowNum={rowNum} />
        ); 
    }
    function mapRows(row, index) {
        rowNum += 1
        return (
            <div className='rowLayout' key={ index }>
                {row.map(mapSeats)}
            </div>
        );
    }
    function handleChangeCardNumber(e) {
        const newValue = e.target.value;
        if (newValue === "" || /^[0-9]+$/.test(newValue)) {
            setCardNumber(newValue);
        }
    }
    function handleChangePinNumber(e) {
        const newValue = e.target.value;
        if (newValue === "" || /^[0-9]+$/.test(newValue)) {
            setPinNumber(newValue);
        }
    }
    function handleReserve(e) {
        const trimmedCardNumber = cardNumber.trimEnd().trimStart();
        const trimmedPinNumber = pinNumber.trimEnd().trimStart();
        if (reservedSeats.length === 0)
        {
            e.preventDefault();
            return false;
        }
        else if (trimmedCardNumber.length < 16) {
            setHelperCredit("Please enter valid credit number.");
            setErrorCredit(true)
            e.preventDefault();
            return false;
        } else if (trimmedPinNumber.length < 3) {
            setHelperCredit("");
            setErrorCredit(false);
            setHelperPin("Please enter valid pin number.");
            setErrorPin(true);
            e.preventDefault();
            return false;
        }
        else {
            axios.post(`https://localhost:44345/api/Customer/ReserveVacantSeats/${matchId}`,
                {
                    PinNumber: pinNumber,
                    CreditCardNumber: cardNumber,
                    Seats: reservedSeats
                },
                { headers: { Authorization: `bearer ${token}` } })
                .then(response => {
                    history.push("/FanPage");  
                })
                .catch(error => {
                    console.log(error)
                });


        }
        e.preventDefault();
    }
    React.useEffect(() => {
        (async () => {
            await axios
                .get(`https://localhost:44345/api/account/ViewStadium/${matchId}`)
                .then((response) => {
                    setSeats(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        })();
    }, []);

    return (<div className="RegisterLayout">
        <div className="seatCard">
            {seats['seats'].map(mapRows)}
            <div className="CrediCardLayout">
            <Grid item xs={6}>
            <TextField
                fullWidth
                type="text"
                label="Card number"
                variant="outlined"
                value={cardNumber}
                color="success"
                onChange={(e) => handleChangeCardNumber(e)}
                inputProps={{ maxLength: 16 }}
                error={errorCredit}
                helperText={helperCredit}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                        fullWidth
                        type="text"
                        label="Pin number"
                        variant="outlined"
                        value={pinNumber}
                        color="success"
                        onChange={(e) => handleChangePinNumber(e)}
                        inputProps={{ maxLength: 3 }}
                        style={{ marginLeft: "4px" }}
                        error={errorPin}
                        helperText={helperPin}
                />
                </Grid>
                <Button color="success" style={{ marginLeft: "10px", width: "40%" }} onClick={(e)=>handleReserve(e)}>Reserve</Button>
            </div>
        </div>
    </div>);
}
export default UserPage;

