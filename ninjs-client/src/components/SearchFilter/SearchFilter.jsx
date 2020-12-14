import React, { useState, useEffect } from "react";
import { getCategories, getLocation } from "../../api/filter";
import { useHistory } from "react-router-dom";

// Bootstrap
import { Container, Col, Row, Form, Button } from "react-bootstrap";

// Css
import "./SearchFilter.scss";

// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);

const SearchFilter = ({ filterChanged }) => {
  const history = useHistory();
  const [eventFilter, setEventFilter] = useState({
    categories: "",
    locations: "",
    date: "",
  });

  const [searchCategories, setSearchCategories] = useState([]);
  const [searchLocation, setSearchLocation] = useState([]);

  const getCategoriesList = async () => {
    const response = await getCategories();
    setSearchCategories(response);
  };

  const getLocationList = async () => {
    const response = await getLocation();
    setSearchLocation(response);
  };

  useEffect(() => {
    getCategoriesList();
    getLocationList();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (event.target.value === "Pick a Category") {
      setEventFilter({ ...eventFilter, [name]: "" });
    } else if (event.target.value === "Pick a Location") {
      setEventFilter({ ...eventFilter, [name]: "" });
    } else {
      setEventFilter({ ...eventFilter, [name]: event.target.value });
    }
  };

  const submitForm = function (e) {
    e.preventDefault();
    if (
      eventFilter.categories !== "" &&
      eventFilter.locations !== "" &&
      eventFilter.date !== ""
    ) {
      history.push({
        pathname: "/",
        search: `?category=${eventFilter.categories}&location=${eventFilter.locations}&date=${eventFilter.date}`,
      });
      // filterChanged(true)
      filterChanged(
        `${eventFilter.categories}-${eventFilter.locations}-${eventFilter.date}`
      );
    } else if (eventFilter.categories !== "" && eventFilter.locations !== "") {
      history.push({
        pathname: "/",
        search: `?category=${eventFilter.categories}&location=${eventFilter.locations}`,
      });
      filterChanged(`${eventFilter.categories}-${eventFilter.locations}`);
    } else if (eventFilter.categories !== "" && eventFilter.date !== "") {
      history.push({
        pathname: "/",
        search: `?category=${eventFilter.categories}&date=${eventFilter.date}`,
      });
      filterChanged(`${eventFilter.categories}-${eventFilter.date}`);
    } else if (eventFilter.locations !== "" && eventFilter.date !== "") {
      history.push({
        pathname: "/",
        search: `?location=${eventFilter.locations}&date=${eventFilter.date}`,
      });
      filterChanged(`${eventFilter.locations}-${eventFilter.date}`);
    } else if (eventFilter.categories !== "") {
      history.push({
        pathname: "/",
        search: `?category=${eventFilter.categories}`,
      });
      filterChanged(`${eventFilter.categories}`);
    } else if (eventFilter.locations !== "") {
      history.push({
        pathname: "/",
        search: `?location=${eventFilter.locations}`,
      });
      filterChanged(`${eventFilter.locations}`);
    } else if (eventFilter.date !== "") {
      history.push({
        pathname: "/",
        search: `?date=${eventFilter.date}`,
      });
      filterChanged(`${eventFilter.date}`);
    } else {
      history.push({
        pathname: "/",
      });
      filterChanged(`none`);
    }
  };

  return (
    <Container fluid>
      <Form className="form" onSubmit={submitForm}>
        <Row>
          {/* col */}
          <Col sm={12} md={4} lg={3}>
            <Form.Group className="form__group" controlId="event-categories">
              <FontAwesomeIcon
                style={{ marginRight: 10 }}
                icon={["fas", "glass-cheers"]}
                size="lg"
              />
              <Form.Label className="form__label">Event Categories</Form.Label>
              <Form.Control
                name="categories"
                className="form__select"
                as="select"
                onChange={handleChange}>
                <option>Pick a Category</option>
                {searchCategories.map((categories) => (
                  <option value={categories.eventCategory}>
                    {categories.eventCategory}
                  </option>
                  // <option value={categories._id}>{categories.eventCategory}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          {/* col */}
          <Col sm={12} md={4} lg={3}>
            <Form.Group className="form__group" controlId="location-categories">
              <FontAwesomeIcon
                style={{ marginRight: 10 }}
                icon={["fas", "map-marker-alt"]}
                size="lg"
              />
              <Form.Label className="form__label">Location</Form.Label>
              <Form.Control
                className="form__select"
                as="select"
                name="locations"
                onChange={handleChange}>
                {/* <option value="choose">Pick a Location</option> */}
                <option>Pick a Location</option>
                {searchLocation.map((locations) => (
                  <option value={locations}>{locations}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col sm={12} md={4} lg={3}>
            <Form.Group className="form__group">
              <FontAwesomeIcon
                style={{ marginRight: 10 }}
                icon={["fas", "clock"]}
                size="lg"
              />
              <Form.Label className="form__label">Date and Time</Form.Label>
              <Form.Control
                type="Date"
                className="form__date"
                id="start-date"
                name="date"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col className="text-center mt-4" sm={12} md={12} lg={3}>
            <Form.Group
              className="form__group form__group--submit"
              controlId="group-control">
              <Button
                variant="danger"
                className="form__submit btn-lg font-weight-bold"
                type="submit">
                Search
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};
export default SearchFilter;
