import React, { useState } from 'react';
import Button from "@mui/material/Button";

function NewButton(props) {
    const [buttonColor, setButtonColor] = useState("outlined"); // Initial color

    function handleClick (e){
        props.handleClick(e)
        if (buttonColor === "outlined") {
            setButtonColor("contained")
        }
        else {
            setButtonColor("outlined")
        }
    };

    return (
        <Button variant={buttonColor} key={props.seatNum} data-user-id={props.seatNum} onClick={(e) => handleClick(e)} disabled={props.seat === "vacant" ? false : true} data-user-seat={props.indexNum} data-user-row={props.rowNum} color="success">{`${props.rowNum}${props.indexNum}`}</Button>
    );
};

export default NewButton;