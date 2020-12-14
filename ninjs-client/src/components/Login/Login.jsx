import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, Link } from "react-router-dom";
// import { getAuth } from "../../api/login";
// import { login } from "../../api/login";
import { login } from "../../actions/auth";
// css
import "./login.scss";
//
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

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
    height: "100vh",
  },
  darkTheme: {
    backgroundColor: "#424242",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    height: "100%",
    margin: theme.spacing(0, 9),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#f48fb1",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");
  const { message } = useSelector((state) => state.message);
  const { user: currentUser, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? "light" : "dark";
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });
  const classes = useStyles();

  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(login(email, password))
      .then(() => {
        // window.location.reload();
        // dispatch(clearMessage())
        // dispatch(clearMessage)
      })
      .catch(() => {
        setLoading(false);
      });
    // .then((response) => {
    //   setAlertMessage(response)
    //   console.log(response)
    // })
    // .catch((error) => {
    //   console.log(error)
    //   setLoading(false);
    // });
  };

  if (isLoggedIn) {
    if (currentUser.role.includes("admin")) {
      return <Redirect to="/admin" />;
    } else if (currentUser.role.includes("company")) {
      return <Redirect to="/company" />;
    } else {
      return <Redirect to="/" />;
    }
  }

  // let alertMsg;
  // if(alertMessage !== '') {
  //   alertMsg = (
  //     <Alert severity="error">This is an error alert — check it out!</Alert>
  //   );
  // } else {
  //   alertMsg = ( '' )
  // }

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <br />
            {/* {alertMsg} */}
            {message && <Alert severity="error">{message}</Alert>}
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </Button>
              <Grid container>
                <Grid item xs>
                  <Switch checked={darkState} onChange={handleThemeChange} />
                </Grid>
                <Grid item>
                  {darkState ? (
                    <Link
                      to="/register"
                      style={{ color: "#222" }}
                      variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      style={{ color: "#fff" }}
                      variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  )}
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
