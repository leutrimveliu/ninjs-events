import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { getCategories } from "../../api/filter";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import "./Category.scss";
import { getEvents } from "../../api/event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faLaptopCode,
  faHandshake,
  faGraduationCap,
  faSuitcaseRolling,
  faHeadphonesAlt,
  faRunning,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles({
  linkStyle: {
    color: "#888",
    "&:hover": { textDecoration: "none", color: "black" },
  },
  listStyle: {
    backgroundColor: "rgb(241, 241, 241)",
    border: "none",
  },
  icons: {
    fontSize: 60,
  },
  paragraph: { fontSize: 24, textAlign: "center" },
});
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Category = () => {
  const classes = useStyles();
  const [searchCategories, setSearchCategories] = useState([]);
  const [categoriesNav, setCategoriesNav] = useState(null);
  const [eventDetails, setEventDetails] = useState([]);
  let query = useQuery();
  let queryCategory = query.get("category");
  const getCategoriesList = async () => {
    const response = await getCategories();
    setSearchCategories(response);
  };
  const getEventsList = async () => {
    const response = await getEvents(queryCategory);
    // setEventDetails(response);
    const filteredUsers = response.filter(
      (approved) => approved.isApproved === true
    );
    setEventDetails(filteredUsers);
  };
  useEffect(() => {
    // window.scrollTo(0, 0);
    getCategoriesList();
  }, [categoriesNav]);
  return (
    <>
      <div className="categories__list">
        <Grid
          container
          alignItems="center"
          style={{ backgroundColor: "rgb(241, 241, 241)", padding: 100 }}
        >
          <Grid item lg={4} md={4} sm={12} xs={12} className="p-5">
            <h1
              style={{ fontSize: 40, fontWeight: "bold" }}
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
                color: "black",
                backgroundColor: "black",
              }}
            ></hr>
            <p>Quick search our top categories</p>
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
              className="p-2"
            >
              <Grid contain lg={2}>
                <Link to={`?category=Art`} className={classes.linkStyle}>
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
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Art</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>

              <Grid item lg={2}>
                <Link to={`?category=Sports`} className={classes.linkStyle}>
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
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Sport</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>

              <Grid item lg={2}>
                <Link to={`?category=Travel`} className={classes.linkStyle}>
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
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Travel</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>

              <Grid item lg={2}>
                <Link to={`?category=Education`} className={classes.linkStyle}>
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
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Education</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
              className="p-2"
            >
              <Grid items lg={2}>
                <Link to={`?category=Music`} className={classes.linkStyle}>
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
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Music</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>

              <Grid item lg={2}>
                <Link to={`?category=Science`} className={classes.linkStyle}>
                  <ListGroup.Item
                    className={classes.listStyle}
                    onClick={() => setCategoriesNav(`Science`)}
                    value="Science"
                    name="categories"
                  >
                    <div className="d-flex justify-content-center">
                      <FontAwesomeIcon
                        icon={faMicroscope}
                        className={classes.icons}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Science</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>

              <Grid item lg={2}>
                <Link to={`?category=Politics`} className={classes.linkStyle}>
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
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Politics</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>

              <Grid item lg={2}>
                <Link
                  to={`?category=Programming`}
                  className={classes.linkStyle}
                >
                  <ListGroup.Item
                    className={classes.listStyle}
                    onClick={() => setCategoriesNav(`Programming`)}
                    value="Programming"
                    name="categories"
                  >
                    <div className="d-flex justify-content-center">
                      <FontAwesomeIcon
                        icon={faLaptopCode}
                        className={classes.icons}
                      />{" "}
                    </div>
                    <div className="d-flex justify-content-center">
                      <p className={classes.paragraph}>Programming</p>
                    </div>
                  </ListGroup.Item>
                </Link>
              </Grid>
            </Grid>

            {/* {searchCategories.map((categories) => (
            <Link
              to={`?category=${categories.eventCategory}`}
              className="category-style"
            > */}
            {/* <Link to={`?category=${categories._id}`} className="category-style" > */}
            {/* <ListGroup.Item
                onClick={() => setCategoriesNav(categories.eventCategory)}
                className="list__group"
                name="categories"
                // value={categories._id}
                value={categories.eventCategory}
              >
                {categories.eventCategory}
              </ListGroup.Item>
            </Link>
          ))} */}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Category;
