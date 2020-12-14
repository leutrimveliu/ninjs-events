import React, { useState, useEffect } from "react";
import { ListGroup, CardDeck, Col, Row } from "react-bootstrap";
import { useLocation, Link, useParams } from "react-router-dom";
import { getCategories } from "../../api/filter";
import {
  getEvents,
  getPopularEvents,
  getFreeEvents,
  getPaidEvents,
} from "../../api/event";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

// css
import "./searchPage.scss";
const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    height: 300,
    margin: "20px",
    backgroundColor: "#fff",
    boxShadow: "1px 1px 10px #555",

    "&:hover": {
      boxShadow: "2px 2px 20px #888",
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
    // backgroundColor: "rgb(241, 241, 241)",
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

const SearchPage = ({ user, filterChanged }) => {
  const classes = useStyles();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [categoriesNav, setCategoriesNav] = useState(null);
  const [searchCategories, setSearchCategories] = useState([]);
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

  const [eventDetails, setEventDetails] = useState([]);
  const [popularEventDetails, setPopularEventDetails] = useState([]);
  const [freeEventDetails, setFreeEventDetails] = useState([]);
  const [paidEventDetails, setPaidEventDetails] = useState([]);
  const [page, setPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [prevPageValue, setPrevPageValue] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [nextPageValue, setNextPageValue] = useState(null);
  const [pgResult, setPgResult] = useState(false);
  const [maxPagination, setMaxPagination] = useState(null);

  const getEventsList = async () => {
    const response = await getEvents(
      queryPage,
      querySearch,
      queryCategory,
      queryLocation,
      queryDate
    );
    setMaxPagination(response.lengthB);
    // if(response.lengthB > response.currentB) {
    //   setMaxPagination(response.lengthB)
    // } else {
    //   setMaxPagination(null)
    // }
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
    <div className="searchpage">
      <Header filterChanged={filterChanged} />
      <div className="title-categories ml-3" style={{ marginTop: "60px" }}>
        <h2>
          {" "}
          {/* Find the event <span className="ninjs-events">YOU</span> like <hr /> */}
          Results for <span className="ninjs-events">{querySearch} </span>{" "}
          <hr />
        </h2>
      </div>
      <div className="events__container">
        {eventDetails
          // .sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
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
                      component="p">
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
                  component="h5">
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
        // <div className={classes.root}>
        <div className="pagination-container">
          <ListGroup horizontal className="List__groups">
            <Link
              to={`?page=${prevPage}`}
              className={`clicked ${prevPageValue}`}>
              <ListGroup.Item
                style={{ border: "none" }}
                className={`list-group pagination-btn ${prevPageValue}`}
                onClick={() => setPage({ prevPage })}
                // >{prevPage}</ListGroup.Item>
              >
                <ChevronLeftIcon className="pagination-icon" />
              </ListGroup.Item>
            </Link>

            {/* <Link to={`?page=${currentPage}`} className="clicked"> */}
            <Link to={`?page=${currentPage}`} className="current-page-hover">
              <ListGroup.Item
                // className="list-group pagination-btn"
                style={{ border: "none" }}
                className="list-group current-page"
                onClick={() => setPage({ currentPage })}
                // >{currentPage} OF {}</ListGroup.Item>
                // >{maxPagination ? currentPage + ' OF ' + maxPagination : currentPage}</ListGroup.Item>
              >
                {currentPage + " OF " + maxPagination}
              </ListGroup.Item>
            </Link>

            <Link
              to={`?page=${nextPage}`}
              className={`clicked ${nextPageValue}`}>
              <ListGroup.Item
                style={{ border: "none" }}
                className={`list-group pagination-btn ${nextPageValue}`}
                onClick={() => setPage({ nextPage })}>
                <ChevronRightIcon className="pagination-icon" />
              </ListGroup.Item>
            </Link>
          </ListGroup>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SearchPage;
