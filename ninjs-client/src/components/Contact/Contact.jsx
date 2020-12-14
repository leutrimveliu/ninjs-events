import React, { useState } from "react";
import emailjs from "emailjs-com";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

// css
//
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { CssBaseline, Switch } from "@material-ui/core";
import RoomIcon from "@material-ui/icons/Room";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import SmartphoneRoundedIcon from "@material-ui/icons/SmartphoneRounded";
import PhoneRoundedIcon from "@material-ui/icons/PhoneRounded";
import { Redirect } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"NINJS TEAM ⚔ "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  darkTheme: {
    backgroundColor: "#424242",
  },
  info: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    // marginTop: -10,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Contact({ filterChanged }) {
  const [darkState, setDarkState] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const palletType = darkState ? "light" : "dark";
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });
  const classes = useStyles();

  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "gmail",
        "template_wtsyypc",
        e.target,
        "user_VXg0wM7bQvV6iklruaU3c"
      )
      .then(
        (result) => {
          console.log("SUCCESS", result.text, result.status);
          alert("Email sent successfully!");
        },
        (error) => {
          console.log(error.text);
        }
      );

    setLoading(true);
    e.target.reset();
    setTimeout(() => {
      <Redirect to={"/contact"} />;
      setLoading(false);
    }, 2000);
  }

  const style = {
    listStyle: "none",
    padding: "20px",
    fontSize: "20px",
    margin: "20px auto",
    lineHeight: 3,
  };

  return (
    <>
      <Header filterChanged={filterChanged} />
      <ThemeProvider theme={darkTheme}>
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={12} md={6}>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Contact Us
              </Typography>
              <br />
              <form
                className={classes.form}
                onSubmit={handleSubmit(sendEmail)}
                noValidate
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Enter Name"
                  name="name"
                  inputRef={register({ required: true, minLength: 3 })}
                />
                <p style={{ color: "white" }}>
                  &#8203;
                  {errors.name && errors.name.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.name && errors.name.type === "minLength" && (
                    <span>
                      This field requires minimum length of 3 characters!
                    </span>
                  )}
                </p>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Enter Email"
                  type="email"
                  name="email"
                  inputRef={register({
                    required: true,
                    minLength: 6,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                />
                <p style={{ color: "white" }}>
                  &#8203;
                  {errors.email && errors.email.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.email && errors.email.type === "minLength" && (
                    <span>
                      This field requires minimum length of 6 characters!
                    </span>
                  )}
                  {errors.email && errors.email.type === "pattern" && (
                    <span>Invalid email address!</span>
                  )}
                </p>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="subject"
                  label="Enter Subject"
                  name="subject"
                  inputRef={register({ required: true, minLength: 6 })}
                />
                <p style={{ color: "white" }}>
                  &#8203;
                  {errors.subject && errors.subject.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.subject && errors.subject.type === "minLength" && (
                    <span>
                      This field requires minimum length of 6 characters!
                    </span>
                  )}
                </p>

                <TextField
                  id="outlined-multiline-static"
                  label="Your message"
                  multiline
                  fullWidth
                  rows={4}
                  name="message"
                  variant="outlined"
                  inputRef={register({ required: true, minLength: 12 })}
                />
                <p style={{ color: "white" }}>
                  &#8203;
                  {errors.message && errors.message.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.message && errors.message.type === "minLength" && (
                    <span>
                      This field requires minimum length of 12 characters!
                    </span>
                  )}
                </p>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>SEND</span>
                </Button>

                <Box mt={5}>
                  <Copyright />
                </Box>
              </form>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} className={classes.info}>
            <ul style={style}>
              <strong>CONTACT US</strong>
              <li>
                <RoomIcon />
                Kalabria Street,10000 Pristina, Kosovo
              </li>
              <li>
                <EmailRoundedIcon />
                info@ninjs-events.com
              </li>
              <li>
                <SmartphoneRoundedIcon />
                Mob: +38344223223
              </li>
              <li>
                <PhoneRoundedIcon />
                Fax: +38338223223
              </li>
            </ul>
          </Grid>
        </Grid>
      </ThemeProvider>
      <Footer />
    </>
  );
}
