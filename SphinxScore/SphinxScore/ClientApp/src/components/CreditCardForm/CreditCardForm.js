import React, { useEffect } from "react";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, InputAdornment, Grid } from "@material-ui/core";

/**
 * CreditCardForm component represents a form for entering credit card information.
 * It uses react-payment-inputs and react-hook-form libraries for input handling and validation.
 */
const CreditCardForm = () => {
  // Get payment input props and form context from react-payment-inputs and react-hook-form
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs();
  const { erroredInputs, touchedInputs } = meta;
  const {
    register,
    errors: formErrors,
    formState,
    triggerValidation,
    setValue,
  } = useFormContext();

  // Function to handle input validation and trigger form validation
  const validation = (name, e) => {
    setValue(name, e.target.value, false);
    triggerValidation(name);
  };

  // Function to handle input blur event
  const handleBlur = () => {
    console.log("This is blur");
  };

  useEffect(() => {
    // Register form inputs with validation rules using react-hook-form
    register(
      { name: "payment.cardnumber" },
      { required: "Enter a card number" }
    );
    register({ name: "payment.expiry" }, { required: "Enter an expiry date" });
    register({ name: "payment.ccv" }, { required: "Enter a CVC" });
    register(
      { name: "payment.accountHolderName" },
      { required: "Name required" }
    );
  }, [register]);

  console.log(meta);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          {...getCardNumberProps({
            refKey: "inputRef",
            onChange: validation.bind(null, "payment.cardnumber"),
          })}
          inputRef={getCardNumberProps({ register }).ref}
          fullWidth
          type="tel"
          label="Credit card number"
          name="payment.cardnumber"
          variant="filled"
          error={
            (erroredInputs.cardNumber && touchedInputs.cardNumber) ||
            !!formErrors?.payment?.cardnumber?.message
          }
          helperText={
            (erroredInputs.cardNumber &&
              touchedInputs.cardNumber &&
              erroredInputs.cardNumber) ||
            formErrors?.payment?.cardnumber?.message
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <svg {...getCardImageProps({ images })} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...getExpiryDateProps({
            refKey: "inputRef",
            onChange: validation.bind(null, "payment.expiry"),
          })}
          inputRef={getExpiryDateProps().ref}
          fullWidth
          type="tel"
          label="Expiry date"
          name="payment.expiry"
          variant="filled"
          error={
            (erroredInputs.expiryDate && touchedInputs.expiryDate) ||
            !!formErrors?.payment?.expiry?.message
          }
          helperText={
            (erroredInputs.expiryDate &&
              touchedInputs.expiryDate &&
              erroredInputs.expiryDate) ||
            formErrors?.payment?.expiry?.message
          }
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...getCVCProps({
            refKey: "inputRef",
            onChange: validation.bind(null, "payment.cvv"),
            onBlur: handleBlur,
          })}
          inputRef={getCVCProps().ref}
          fullWidth
          type="tel"
          label="CVV"
          name="payment.cvv"
          variant="filled"
          error={
            (erroredInputs.cvc && touchedInputs.cvc) ||
            !!formErrors?.payment?.ccv?.message
          }
          helperText={
            (erroredInputs.cvc && touchedInputs.cvc && erroredInputs.cvc) ||
            formErrors?.payment?.ccv?.message
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Name on Card"
          placeholder="J Smith"
          name="payment.accountHolderName"
          inputRef={register}
          error={!!formErrors.payment?.accountHolderName?.message}
          helperText={formErrors.payment?.accountHolderName?.message}
          onChange={validation.bind(null, "payment.accountHolderName")}
        />
      </Grid>
    </Grid>
  );
};

export default CreditCardForm;
