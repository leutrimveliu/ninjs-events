import React, { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import MainListItems from "./listItems";
import { NavLink } from "react-router-dom";
import CompanyEventsTable from "./Tables/CompanyEventsTable";
import CurrentRequests from "./Tables/CurrentRequests";
import ApprovedRequests from "./Tables/ApprovedRequests";
import { useSelector } from "react-redux";

// css
import "./Dashboard.scss";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24,
    backgroundColor: "#333",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  // appBarShift: {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(["width", "margin"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: "#333",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    minHeight: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function CompanyDashboard() {
  const [companyDash, setCompanyDash] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const location = useLocation();

  function renderSwitch(param) {
    // function renderSwitch(param, query) {
    switch (param) {
      case "/company":
        return <CompanyEventsTable />;
      case "/company/events":
        return <CompanyEventsTable />;
      case "/company/currentRequests":
        return <CurrentRequests />;
      case "/company/approvedRequests":
        return <ApprovedRequests />;
      // case `/company/editprofile/${currentUser.user._id}`:
      //   return <EditCompanyProfile />;
      // case "/company/createevent":
      //   return <CreateEventDash />;
      // case `/company/EditEvent`:
      //   // return <EditEventDash query={query} />;
      //   return <EditEventDash />;

      // case "/admin/users":
      //   return <UserTable />;
      // case "/admin/admins":
      //   return <AdminTable />;
      // case "/admin/companies":
      // return <CategoryTable />;
      // case "/admin/categories":
      // return <CompanyTable />;

      default:
        console.log("Wrong path");
    }
  }
  useEffect(() => {
    if (currentUser) {
      // setCreateEvent(currentUser.role.includes("user"));
      setCompanyDash(
        currentUser.role.includes("admin") || currentUser.role.includes("user")
      );
    }
  }, [currentUser]);

  // if (!localStorage.getItem("token")) {
  //   return <Redirect to={"/"} />;
  // }
  if (companyDash || !currentUser) {
    return <Redirect to={"/"} />;
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            className={classes.title}
            color="inherit"
            noWrap
          >
            <NavLink to="/company" className="dashboard__link">
              ninJS Events
            </NavLink>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <List style={{ marginTop: "20px" }}>
          {" "}
          <MainListItems />
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            {/* <Grid item xs={12} md={8} lg={12}>
              <Paper className={fixedHeightPaper}>{/* <Chart /> */}

            {/* Recent Deposits */}
            {/* <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid> */}
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                {renderSwitch(location.pathname, location.search)}
                {/* {renderSwitch(location.pathname, location.search)} */}

                {/* <CreateEvent /> */}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
