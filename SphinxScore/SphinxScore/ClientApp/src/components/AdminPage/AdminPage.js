import React, { useState, useEffect } from "react";
import "./AdminPage.css";
import TopMenu from "./TopMenu";
import Button from "@mui/material/Button";
import axios from "axios";

function AdminPage() {
    const [nonApprovedUsers, setNonApprovedUsers] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [handleButton, setHandleButton] = useState(false);
    const token = localStorage.getItem("token")
    console.log("token = ");
    console.log(token);
    React.useEffect(() => {
        (async () => {
            await axios
                .get("https://localhost:44345/api/admin/NonApprovedUsers", { headers: { Authorization: `bearer ${token}` } })
                .then((response) => {
                    setNonApprovedUsers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        })();
        (async () => {
            await axios
                .get("https://localhost:44345/api/admin/ApprovedUsers", { headers: { Authorization: `bearer ${token}` } })
                .then((response) => {
                    setApprovedUsers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        })();
    }, [handleButton]);

    function handleApproval(e) {
        axios.patch(`https://localhost:44345/api/admin/ApproveUser/${e.target.dataset.userId}`, null, { headers: { Authorization: `bearer ${token}` } })
            .then(response => {
                console.log('Patch successful:', response.data);
                if (handleButton) {
                    setHandleButton(false)
                }
                else {
                    setHandleButton(true)
                }
            })
            .catch(error => {
            });
    }
    function handleRemoval(e) {

        axios.delete(`https://localhost:44345/api/admin/DeleteUser/${e.target.dataset.userId}`, { headers: { Authorization: `bearer ${token}` } })
            .then(response => {
                if (handleButton) {
                    setHandleButton(false)
                }
                else {
                    setHandleButton(true)
                }
            })
            .catch(error => {
            });
    }
    function mapUsers(user) {
        return (
            <div className="UserLayout" key={user.id}>
                <div className="Containers">
                    <div className="Container">
                        <label>Username:</label>
                        <p>{user.username}</p>
                    </div>
                    <div className="Container">
                        <label>First name:</label>
                        <p>{user.first_name}</p>
                    </div>
                    <div className="Container">
                        <label>Last Name:</label>
                        <p>{user.last_name}</p>
                    </div>
                    <div className="Container">
                        <label>Gender:</label>
                        <p>{user.gender}</p>
                    </div>
                    <div className="Container">
                        <label>City:</label>
                        <p>{user.city}</p>
                    </div>
                    <div className="Container">
                        <label>Email address:</label>
                        <p>{user.email_address}</p>
                    </div>
                    <div className="Container">
                        <label>Role:</label>
                        <p>{user.role}</p>
                    </div>
                    <div className="Container">
                        <label>Status:</label>
                        <p>not approved</p>
                    </div>
                </div>
                <div className="Buttons">
                    {(!user.isApproved) && (<Button variant="contained" style={{ margin: "4px" }} color="success" data-user-id={user.id} onClick={handleApproval}>
                        Approve
                    </Button>)}
                    <Button variant="contained" style={{ margin: "4px" }} color="error" data-user-id={user.id} onClick={handleRemoval}>
                        Remove
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className="AdminPageLayout">
            <TopMenu user='admin'/>
            <h2>Users</h2>
            <div className="AllUsers">
                {nonApprovedUsers.map(mapUsers)}
                {approvedUsers.map(mapUsers)}
            </div>
        </div>
    );
}
    export default AdminPage;