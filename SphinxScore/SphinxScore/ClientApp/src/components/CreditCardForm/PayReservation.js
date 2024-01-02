import React from "react";
import "./styles.css";
import FormWrapper from "./components/FormWrapper";
import CreditCardForm from "./components/CreditCardForm";

export default function App() {
  return (
    <div className="App">
      <FormWrapper>
        <CreditCardForm />
      </FormWrapper>
    </div>
  );
}
