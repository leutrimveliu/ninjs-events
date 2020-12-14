import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
// import Link from "@material-ui/core/Link";
import { getUserBookings } from "../../api/payment";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Cards from "./Card/Cards";

// css
import "./Profile.scss";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Profile() {
  const classes = useStyles();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [userBooking, setUserBooking] = useState([]);
  let query = useQuery();
  let queryDate = query.get("date");
  const [dateQuery, setDateQuery] = useState(null);

  const getUserProfileBookings = async () => {
    // const response = await getUserBookings(currentUser.user._id);
    const response = await getUserBookings(currentUser.user._id, queryDate);
    setUserBooking(response);
  };

  useEffect(() => {
    getUserProfileBookings();
  }, [dateQuery]);
  // }, [userBooking]);

  return (
    <React.Fragment>
      <Header />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  {/* <Button variant="contained" color="primary">
                    Present/Future Events
                  </Button> */}
                  <Link to="?date=present">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setDateQuery("present")}
                    >
                      Current Events
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  {/* <Button variant="outlined" color="primary">
                    Past Events
                  </Button> */}
                  <Link to="?date=past">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setDateQuery("past")}
                    >
                      Past Events
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <div className="profile__cards">
          {userBooking.map((card) => (
            <Grid item xs="auto">
              <Cards
                id={card._id}
                image={`http://localhost:4000/assets/uploads/${card.eventPhoto}`}
                title={card.eventTitle}
                location={card.eventLocation}
                price={card.eventPrice}
                date={card.startDate}
              />
            </Grid>
          ))}
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}
