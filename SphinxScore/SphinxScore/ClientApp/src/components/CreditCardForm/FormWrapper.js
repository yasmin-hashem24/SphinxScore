import React from "react";
import { Box, Button } from "@material-ui/core";
import { FormContext, useForm } from "react-hook-form";

const FormWrapper = ({ children }) => {
  const useHookForm = useForm({
    mode: "onBlur",
  });
  const onFormSubmit = (data) => {
    console.log(data);
  };
  return (
    <FormContext {...useHookForm}>
      <form noValidate onSubmit={useHookForm.handleSubmit(onFormSubmit)}>
        {children}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </FormContext>
  );
};

export default FormWrapper;
