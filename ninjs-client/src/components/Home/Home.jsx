import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ListGroup, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

// api's
import { getCategories } from "../../api/filter";
import {
  getEvents,
  getPopularEvents,
  getFreeEvents,
  getPaidEvents,
} from "../../api/event";

// components
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SearchFilter from "../SearchFilter/SearchFilter";

// material ui imports
import {
  makeStyles,
  Card,
  Grid,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core/";
import {
  faVestPatches,
  faLaptopCode,
  faHandshake,
  faGraduationCap,
  faSuitcaseRolling,
  faHeadphonesAlt,
  faRunning,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// css
import "./Home.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    minHeight: 320,
    margin: "20px",
    boxShadow: "0 0 5px #555",
    "&:hover": {
      boxShadow: "0 0 10px #000",
    },
    position: "relative",
    [theme.breakpoints.down(1170)]: {
      width: 250,
      height: 320,
    },
    [theme.breakpoints.down(885)]: {
      width: 350,
    },
    [theme.breakpoints.down(820)]: {
      width: "100%",
      height: "auto",
      display: "flex",
    },
    [theme.breakpoints.down(560)]: {
      display: "block",
    },
  },
  rootContainer: {
    padding: 100,
    [theme.breakpoints.down(600)]: {
      width: "100%",
      padding: 0,
    },
  },
  linkStyle: {
    color: "white",
    "&:hover": { textDecoration: "none", color: "#888" },
  },
  listStyle: {
    [theme.breakpoints.down(600)]: {
      width: 50,
    },
    color: "white",
    backgroundColor: "#333",
    border: "none",
  },
  favContainer: {
    [theme.breakpoints.down(600)]: {
      width: 50,
      margin: 0,
    },
  },
  icons: {
    [theme.breakpoints.down(600)]: {
      fontSize: 20,
    },
    fontSize: 50,
  },
  paragraph: {
    [theme.breakpoints.down(600)]: {
      fontSize: 20,
    },

    fontSize: 24,
    textAlign: "center",
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ user, filterChanged }) => {
  const classes = useStyles();
  // states
  const [eventDetails, setEventDetails] = useState([]);
  const [popularEventDetails, setPopularEventDetails] = useState([]);
  const [freeEventDetails, setFreeEventDetails] = useState([]);
  const [paidEventDetails, setPaidEventDetails] = useState([]);
  const [categoriesNav, setCategoriesNav] = useState(null);
  const [searchCategories, setSearchCategories] = useState([]);
  const [page, setPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [prevPageValue, setPrevPageValue] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [nextPageValue, setNextPageValue] = useState(null);
  const [pgResult, setPgResult] = useState(false);
  const [maxPagination, setMaxPagination] = useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);

  const getCategoriesList = async () => {
    const response = await getCategories();
    setSearchCategories(response);
  };

  let query = useQuery();
  let queryPage = query.get("page");
  let querySearch = query.get("title");
  let queryCategory = query.get("category");
  let queryLocation = query.get("location");
  let queryDate = query.get("date");
  const getEventsList = async () => {
    const response = await getEvents(
      queryPage,
      querySearch,
      queryCategory,
      queryLocation,
      queryDate
    );
    setMaxPagination(response.lengthB);
    setEventDetails(response.event);
    setPgResult(response.pgResult);
    if (response.pgResult) {
      setCurrentPage(response.currentB);
      if (response.prevB == null) {
        setPrevPage("0");
        setPrevPageValue("pgDisabled");
      } else {
        setPrevPage(response.prevB);
        setPrevPageValue("");
      }
      if (response.nextB == null) {
        setNextPage("0");
        setNextPageValue("pgDisabled");
      } else {
        setNextPage(response.nextB);
        setNextPageValue("");
      }
    }
  };

  const getPopularEventsList = async () => {
    const response = await getPopularEvents();
    setPopularEventDetails(response);
  };

  const getFreeEventsList = async () => {
    const response = await getFreeEvents();
    setFreeEventDetails(response);
  };

  const getPaidEventsList = async () => {
    const response = await getPaidEvents();
    setPaidEventDetails(response);
  };

  useEffect(() => {
    getPopularEventsList();
    getFreeEventsList();
    getPaidEventsList();
    getEventsList();
    getCategoriesList();
  }, [filterChanged, categoriesNav, currentUser, page]);

  return (
    <>
      <div className="showcase__banner">
        <Header filterChanged={filterChanged} />
        <div className="showcase__content">
          <Row
            className="event-banner justify-content-center mb-5 mt-5 m-0"
            md={12}
          >
            <Col className="justify-content-center mt-5" sm={12}>
              <div className="quote text-center">
                <h1>
                  Events become feelings, <br></br>
                  feelings become events...
                </h1>
              </div>
            </Col>
          </Row>
          <SearchFilter filterChanged={filterChanged} />
        </div>
      </div>
      <div className="title-categories ml-3" style={{ marginTop: "60px" }}>
        <h2>
          Find <span className="ninjs-events">YOUR</span> favorite events <hr />
        </h2>
      </div>
      <div className="events__container">
        {eventDetails.map((event) => (
          <Card className={classes.root}>
            <Link to={`event/${event._id}`} className="event-opener">
              <CardActionArea className="image__container">
                <CardMedia
                  component="img"
                  alt="event random picture"
                  height="140"
                  image={`http://localhost:4000/assets/uploads/${event.eventPhoto}`}
                />
              </CardActionArea>
            </Link>

            <CardContent class="card__content">
              <Link to={`event/${event._id}`} className="event-opener">
                <CardActionArea>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {event.eventTitle}
                  </Typography>
                </CardActionArea>
              </Link>

              <Typography gutterBottom variant="h5" component="h2">
                {event.startDate.split("T")[0]}
              </Typography>

              <Typography variant="body2" color="textSecondary" component="h5">
                {event.eventDescription.substr(0, 100)}...
              </Typography>
            </CardContent>

            <CardActions>
              <Button size="small" color="primary" className="event__tickets">
                {`Tickets: ${event.eventTickets}`}
              </Button>
              <Button size="small" color="primary" className="event__prize">
                {event.eventPrice === 0 ? "Free" : event.eventPrice + " $"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
      {pgResult && (
        <div className="pagination-container">
          <ListGroup horizontal className="List__groups">
            <Link
              to={`?page=${prevPage}`}
              className={`clicked ${prevPageValue}`}
            >
              <ListGroup.Item
                style={{ border: "none" }}
                className={`list-group pagination-btn ${prevPageValue}`}
                onClick={() => setPage({ prevPage })}
              >
                <ChevronLeftIcon className="pagination-icon" />
              </ListGroup.Item>
            </Link>

            <Link to={`?page=${currentPage}`} className="current-page-hover">
              <ListGroup.Item
                style={{ border: "none" }}
                className="list-group current-page"
                onClick={() => setPage({ currentPage })}
              >
                {currentPage + " OF " + maxPagination}
              </ListGroup.Item>
            </Link>

            <Link
              to={`?page=${nextPage}`}
              className={`clicked ${nextPageValue}`}
            >
              <ListGroup.Item
                style={{ border: "none" }}
                className={`list-group pagination-btn ${nextPageValue}`}
                onClick={() => setPage({ nextPage })}
              >
                <ChevronRightIcon className="pagination-icon" />
              </ListGroup.Item>
            </Link>
          </ListGroup>
        </div>
      )}

      <div className="categories__list" style={{ marginBottom: 60 }}>
        <Grid
          container
          alignItems="center"
          style={{ backgroundColor: "#333" }}
          className={classes.rootContainer}
        >
          <Grid item lg={4} md={4} sm={12} xs={12} className="p-5">
            <h1
              style={{ fontSize: 40, fontWeight: "bold", color: "white" }}
              className="align-content-md-center"
            >
              Choose your <br></br> favourite category
            </h1>
            <hr
              style={{
                textAlign: "left",
                marginLeft: 0,
                width: "15%",
                height: 4,
                borderWidth: 0,
                color: "white",
                backgroundColor: "white",
              }}
            ></hr>
            <p style={{ color: "white" }}>Quick search our top categories</p>
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
              className="p-2"
            >
              <Grid contain lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Art`)}
                  value="Art"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faPaintBrush}
                      className={classes.icons}
                    />{" "}
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Arts</p>
                  </div>
                </ListGroup.Item>
              </Grid>

              <Grid item lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Sports`)}
                  value="Sports"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faRunning}
                      className={classes.icons}
                    />
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Sports</p>
                  </div>
                </ListGroup.Item>
              </Grid>

              <Grid item lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Travel`)}
                  value="Travel"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faSuitcaseRolling}
                      className={classes.icons}
                    />{" "}
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Travel</p>
                  </div>
                </ListGroup.Item>
              </Grid>

              <Grid item lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Education`)}
                  value="Education"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className={classes.icons}
                    />{" "}
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Education</p>
                  </div>
                </ListGroup.Item>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
              className="p-2"
            >
              <Grid items lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Music`)}
                  value="Music"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faHeadphonesAlt}
                      className={classes.icons}
                    />{" "}
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Music</p>
                  </div>
                </ListGroup.Item>
              </Grid>

              <Grid item lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Science`)}
                  value="Science"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faLaptopCode}
                      className={classes.icons}
                    />
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Science</p>
                  </div>
                </ListGroup.Item>
              </Grid>

              <Grid item lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Politics`)}
                  value="Politics"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faHandshake}
                      className={classes.icons}
                    />{" "}
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Politics</p>
                  </div>
                </ListGroup.Item>
              </Grid>

              <Grid item lg={2} className={classes.favContainer}>
                <ListGroup.Item
                  className={classes.listStyle}
                  onClick={() => setCategoriesNav(`Programming`)}
                  value="Programming"
                  name="categories"
                >
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faVestPatches}
                      className={classes.icons}
                    />{" "}
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className={classes.paragraph}>Fashion</p>
                  </div>
                </ListGroup.Item>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className="event-categories">
        <div className="title-categories ml-3">
          <h2>
            Popular in{" "}
            <span className="ninjs-events">
              Ninjs Events <hr />
            </span>
          </h2>
        </div>
      </div>
      <div className="events__container">
        {popularEventDetails
          .sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
          .map((event) => (
            <Card className={classes.root}>
              <Link to={`event/${event._id}`} className="event-opener">
                <CardActionArea className="image__container">
                  <CardMedia
                    component="img"
                    alt="event random picture"
                    height="140"
                    image={`http://localhost:4000/assets/uploads/${event.eventPhoto}`}
                  />
                </CardActionArea>
              </Link>

              <CardContent class="card__content">
                <Link to={`event/${event._id}`} className="event-opener">
                  <CardActionArea>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {event.eventTitle}
                    </Typography>
                  </CardActionArea>
                </Link>

                <Typography gutterBottom variant="h5" component="h2">
                  {event.startDate.split("T")[0]}
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="h5"
                >
                  {event.eventDescription.substr(0, 100)}...
                </Typography>
              </CardContent>

              <CardActions>
                <Button size="small" color="primary" className="event__tickets">
                  {`Tickets: ${event.eventTickets}`}
                </Button>
                <Button size="small" color="primary" className="event__prize">
                  {event.eventPrice === 0 ? "Free" : event.eventPrice + " $"}
                </Button>
              </CardActions>
            </Card>
          ))}
      </div>
      <Footer />
    </>
  );
};

export default Home;
