import React, { useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
} from "mdb-react-ui-kit";

import HeaderMenu from "../TopBar/HeaderMenu";
import dayjs from "dayjs";

export default function UserPage() {
  const [firstName, getFirstName] = useState("yasmeen");
  const [lastName, getLastName] = useState("zaki");
  const [username, getUsername] = useState("yasmiinezaki");
  const [email, getEmail] = useState("nossair101@gmail.com");
  const [date, getDate] = useState(dayjs());
  const [gender, getGender] = useState("male");
  const [city, getCity] = useState("Cairo");
  const [address, getAddress] = useState("Malaksh Da3wa");

  function HandleRetrieval(e) {
    e.preventDefault();

    axios
      .get(`https://localhost:44345/api/account/${username}`) // replace with your API endpoint
      .then((response) => {
        const user = response.data;
        getFirstName(user.first_name);
        getLastName(user.last_name);
        getUsername(user.username);
        getEmail(user.email_address);
        getDate(dayjs(user.birth_date));
        getGender(user.gender);
        getCity(user.city);
        getAddress(user.address);
      })
      .catch((error) => {
        console.log(error);
        // handle error
      });
  }

  useEffect(() => {
    HandleRetrieval();
  }, []);

  return (
    <div>
      <div>
        {/* Render the HeaderMenu component */}
        <HeaderMenu />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#ece3ce",
            width: "15%",
            paddingLeft: "10%",
            paddingRight: "10%",
            paddingBottom: "5%",
            paddingTop: "2%",
            margin: "4%",
            borderRadius: "10px",
            boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <MDBContainer className="container py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol md="12" xl="4">
                <MDBCard style={{ borderRadius: "15px" }}>
                  <MDBCardBody className="text-center">
                    {/* Render the user's profile image */}
                    <div className="mt-3 mb-4">
                      <MDBCardImage
                        src="https://img.freepik.com/free-vector/vector-isolated-realistic-soccer-ball-white_1284-41932.jpg?w=740&t=st=1704194097~exp=1704194697~hmac=1ccd00bbdfa8aa1fe5e7b4b918df632c4e41d83df2f3b993aa6646d2d6c23671"
                        className="rounded-circle"
                        fluid
                        style={{ width: "100px" }}
                      />
                    </div>

                    {/* Render the user's first name and last name */}
                    <MDBTypography tag="h4">
                      {firstName + " " + lastName}
                    </MDBTypography>

                    {/* Render the user's occupation and website */}
                    <MDBCardText className="text-muted mb-4">
                      {username} <span className="mx-2">|</span>{" "}
                      <a href="#!">{email}</a>
                    </MDBCardText>
                    {/* Render the "Message now" button */}

                    <div className="d-flex justify-content-between text-center mt-5 mb-2">
                      {/* Render the user's wallet balance */}
                      <div>
                        <MDBCardText className="small text-muted mb-0">
                          Date of Birth:
                        </MDBCardText>
                        <MDBCardText className="mb-1 h5">{date}</MDBCardText>
                      </div>

                      {/* Render the user's number of followers */}
                      <div className="px-3">
                        <MDBCardText className="small text-muted mb-0">
                          Gender:
                        </MDBCardText>
                        <MDBCardText className="mb-1 h5">{gender}</MDBCardText>
                      </div>

                      {/* Render the user's total transactions */}
                      <div>
                        <MDBCardText className="small text-muted mb-0">
                          City:
                        </MDBCardText>
                        <MDBCardText className="mb-1 h5">{city}</MDBCardText>
                      </div>
                    </div>

                    {/* Render the user's total transactions */}
                    <div>
                      <MDBCardText className="small text-muted mb-0">
                        Address:
                      </MDBCardText>
                      <MDBCardText className="mb-1 h5">{address}</MDBCardText>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    </div>
  );
}
