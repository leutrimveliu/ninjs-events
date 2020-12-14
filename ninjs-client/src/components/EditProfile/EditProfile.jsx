import React, { useState, useEffect } from "react";
import { editUser, getUser } from "../../api/register";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
// import {Form} from "react-bootstrap";
// css

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import "./EditProfile.scss";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// export default function Register() {
const EditProfile = () => {
  const history = useHistory();
  let { id } = useParams();
  const classes = useStyles();
  const [showEditForm, setShowEditForm] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [errMessage, setErrMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [userDetails, setUserDetails] = useState({});
  const getUserFields = async () => {
    const response = await getUser(id);
    setUserDetails((oldDetails) => ({
      ...oldDetails,
      firstName: response.firstName,
      lastName: response.lastName,
      password: response.password,
    }));
    setShowEditForm(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const onSubmit = async (data, e) => {
    const registerData = {
      firstName: data.firstName,
      lastName: data.lastName,
      oldPassword: data.oldPassword,
      password: data.password,
    };

    try {
      const response = await editUser(registerData, id);

      setErrMessage(response.errMessage);

      setSuccessMessage(response.successMessage);
      e.target.reset();
      // setTimeout(() => {
      //   history.push("/login");
      // }, 2000);
    } catch (e) {}
  };
  useEffect(() => {
    getUserFields();
  }, [currentUser]);
  // if (currentUser) {
  //   return <Redirect to={"/"} />;
  // }

  return (
    <>
      {currentUser.role.includes("user") ? <Header /> : ""}

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            style={{ marginBottom: "20px" }}
            component="h1"
            variant="h5"
          >
            Edit your profile
          </Typography>
          <br />
          {errMessage && <Alert severity="error">{errMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <br />
          {/* <FormControl
          className={classes.formControl}
          onSubmit={handleSubmit(onSubmit)}
        > */}
          <form
            className={classes.formControl}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  // autoComplete="fname"
                  variant="outlined"
                  label="First Name"
                  InputLabelProps={{ shrink: true }}
                  // required
                  fullWidth
                  name="firstName"
                  type="text"
                  id="firstName"
                  value={userDetails.firstName}
                  onChange={handleChange}
                  inputRef={register({ required: true, minLength: 3 })}
                  // onChange={handleChange}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.firstName && errors.firstName.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.firstName &&
                    errors.firstName.type === "minLength" && (
                      <span>
                        This field requires minimum length of 3 characters!
                      </span>
                    )}
                </p>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Last Name"
                  InputLabelProps={{ shrink: true }}
                  // required
                  fullWidth
                  name="lastName"
                  type="text"
                  id="lastName"
                  value={userDetails.lastName}
                  onChange={handleChange}
                  // autoComplete="lname"
                  inputRef={register({ required: true, minLength: 3 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.lastName && errors.lastName.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.lastName && errors.lastName.type === "minLength" && (
                    <span>
                      This field requires minimum length of 3 characters!
                    </span>
                  )}
                </p>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  // required
                  fullWidth
                  name="oldPassword"
                  label="Current Password"
                  InputLabelProps={{ shrink: true }}
                  type="password"
                  id="oldPassword"
                  // onChange={handleChange}
                  // value={userDetails.oldPassword}
                  // autoComplete="current-password"
                  inputRef={register({ required: true, minLength: 6 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.oldPassword &&
                    errors.oldPassword.type === "required" && (
                      <span>This field is required!</span>
                    )}
                  {errors.oldPassword &&
                    errors.oldPassword.type === "minLength" && (
                      <span>
                        This field requires minimum length of 6 characters!
                      </span>
                    )}
                </p>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-helperText"
                  label="New Password"
                  InputLabelProps={{ shrink: true }}
                  // required
                  fullWidth
                  name="password"
                  variant="outlined"
                  type="password"
                  // onChange={handleChange}
                  // value={userDetails.password}
                  // autoComplete="current-password"
                  inputRef={register({ required: true, minLength: 6 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.password && errors.password.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.password && errors.password.type === "minLength" && (
                    <span>
                      This field requires minimum length of 6 characters!
                    </span>
                  )}
                </p>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginBottom: "15px" }}
                // className={classes.submit}
                // onClick={handleSubmit}
                type="submit"
              >
                Submit
              </Button>
              {/* <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid> */}
            </Grid>
          </form>
        </div>
        <Box mt={5}></Box>
      </Container>
      {currentUser.role.includes("user") ? <Footer /> : ""}
    </>
  );
};

export default EditProfile;
