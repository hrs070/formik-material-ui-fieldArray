import { Typography } from '@material-ui/core';
import { Button, Card, CardContent, Grid, CircularProgress, makeStyles } from '@material-ui/core';
import { Field, FieldArray, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React from 'react';
import { object, number, string, boolean, array, ValidationError } from 'yup';

const useStyles = makeStyles((theme) => ({
  errorColor: {
    color: theme.palette.error.main
  }
}))

export default function Home() {

  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Formik initialValues={{ fullName: '', donationsAmount: 0, termsAndCondition: false, donations: [{ institution: '', percentage: 0 }] }}
          validationSchema={object({
            fullName: string().required("Required").max(50, "Max 50 characters allowed"),
            donationsAmount: number().required("Required").min(10, "Minimum donation amount is Rs. 10"),
            termsAndCondition: boolean().required("Required").isTrue("Accept terms and conditions"),
            donations: array(object({
              institution: string().required("Required"),
              percentage: number().required("Required").min(1, "Minimum 1 percent").max(100, "Maximum 100 percent")
            })).min(1, "At least 1 donation required").max(3, "Upto 3 donations accepted")
              .test((donations) => {
                const sum = donations.reduce((acc, curr) => acc + curr.percentage, 0);
                if (sum !== 100) {
                  return new ValidationError(`Percentage should add upto 100%, but you have ${sum}%`, undefined, "donations");
                }
                return true;
              })
          })}
          onSubmit={async (values) => {
            console.log("values", values)
            return new Promise(resolve => setTimeout(resolve, 2000));
          }}>

          {({ values, errors, isSubmitting, isValid }) => (
            <Form autoComplete="off">
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Field name="fullName" component={TextField} label="Full Name" />
                </Grid>
                <Grid item>
                  <Field name="donationsAmount" type="number" component={TextField} label="Donations (₹)" />
                </Grid>

                <FieldArray name="donations">
                  {({ push, remove }) => (
                    <>
                      <Grid item>
                        <Typography>All your Donations</Typography>
                      </Grid>

                      {values.donations.map((_, index) => (

                        <Grid container spacing={2} key={index}>
                          <Grid item>
                            <Field name={`donations[${index}].institution`} component={TextField} label="Institution" size="small" />
                          </Grid>
                          <Grid item>
                            <Field name={`donations[${index}].percentage`} component={TextField} label="Percentage" type="number" size="small" />
                          </Grid>
                          <Grid item>
                            <Button onClick={() => remove(index)} variant="outlined" color="secondary" >Delete</Button>
                          </Grid>
                        </Grid>

                      ))}

                      <Grid item>
                        {typeof errors.donations === "string" ? <Typography color="error">{errors.donations}</Typography> : null}
                      </Grid>
                      <Grid item>
                        <Button onClick={() => push({ institution: '', percentage: 0 })} variant="contained" color="primary">Add More Fields</Button>
                      </Grid>

                    </>
                  )}
                </FieldArray>

                <Grid item>
                  <Field name="termsAndCondition" type="checkbox" component={CheckboxWithLabel} Label={{ label: "I Accept the Terms and Conditions", className: errors.termsAndCondition ? classes.errorColor : undefined }} />
                </Grid>

                <Grid item>
                  <Button disabled={!isValid || isSubmitting} type="submit" variant="contained" color="primary" startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null} >{isSubmitting ? "Submitting" : "Submit"}</Button>
                </Grid>

              </Grid>
              <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
            </Form>
          )}

        </Formik>
      </CardContent>
    </Card >
  );
}
