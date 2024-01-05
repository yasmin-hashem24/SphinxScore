import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import "./Reservations.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';


function UserPage() {
    let rowNum = -1;
    let seatNum = -1
    const [seats, setSeats] = useState({ "seats": [] })
    const { matchId } = useParams();

    
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
    function mapSeats(seat, index) {
        seatNum += 1
        return (
            <Button variant="outlined" key={seatNum} data-user-id={seatNum} disabled={seat === "vacant" ? false : true} data-user-seat={index} data-user-row={rowNum} color="success">{`${rowNum}${index}`}</Button>
        );
    }
    function mapRows(row, index) {
        rowNum += 1
        return (
            <div className='rowLayout' key={index}>
                {row.map(mapSeats)}
            </div>
        );
    }
    return (<div className="RegisterLayout">
        <div className="seatCard">
            {seats['seats'].map(mapRows)}
        </div>
    </div>);
}
export default UserPage;

