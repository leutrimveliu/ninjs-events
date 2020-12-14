import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { addEvent } from "../../api/event";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { getCategories, getLocation } from "../../api/filter";
import { useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";

// css
import "./CreateEvent.scss";

const CreateEvent = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [errMessage, setErrMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [searchCategories, setSearchCategories] = useState([]);
  const [searchLocation, setSearchLocation] = useState([]);

  const getCategoriesList = async () => {
    const response = await getCategories();
    setSearchCategories(response);
    console.log(response);
  };

  const getLocationList = async () => {
    const response = await getLocation();
    setSearchLocation(response);
  };

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data, e) => {
    console.log("Form has been submitted");
    console.log(currentUser.user);

    let form = new FormData();
    form.append("eventPhoto", data.eventPhoto[0]);
    form.append("eventTitle", data.eventTitle);
    form.append("eventCategory", data.eventCategory);
    form.append("eventDescription", data.eventDescription);
    form.append("eventLocation", data.eventLocation);
    form.append("eventPrice", data.eventPrice);
    form.append("eventTickets", data.eventTickets);
    form.append("eventStart", data.eventStart);
    form.append("eventEnd", data.eventEnd);
    form.append("user_id", currentUser.user._id);
    try {
      const response = await addEvent(form);
      setErrMessage(response.errMessage);
      setSuccessMessage(response.successMessage);
      e.target.reset();
    } catch (e) {}
  };

  useEffect(() => {
    getCategoriesList();
    getLocationList();
  }, []);

  if (currentUser) {
    if (
      currentUser.role.includes("user") ||
      currentUser.role.includes("admin")
    ) {
      return <Redirect to="/" />;
    }
  } else {
    return <Redirect to="/" />;
  }

  const todayDate = format(new Date(), "yyyy-MM-dd");

  return (
    <>
      {/* <CompanyDashboard /> */}
      <div className="create__event ">
        <div className="event__container">
          <h1>Create an Event</h1>
        </div>
        <div className="event__container">
          {errMessage && <Alert severity="error">{errMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </div>
        <div className="event__container">
          <Form
            className="event__form col-md-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row>
              <Col className="col-12 col-md-6">
                <Form.Group controlId="eventPhoto">
                  <Form.Label>Upload an Event Photo</Form.Label>
                  <Form.File
                    name="eventPhoto"
                    ref={register({ required: true })}
                  />
                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventPhoto &&
                      errors.eventPhoto.type === "required" && (
                        <span>This field is required!</span>
                      )}
                  </p>
                </Form.Group>
                <Form.Group controlId="eventTitle">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    name="eventTitle"
                    type="text"
                    placeholder="Event Title..."
                    ref={register({ required: true, minLength: 3 })}
                  />
                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventTitle &&
                      errors.eventTitle.type === "required" && (
                        <span>This field is required!</span>
                      )}
                    {errors.eventTitle &&
                      errors.eventTitle.type === "minLength" && (
                        <span>
                          This field requires minimum length of 3 characters!
                        </span>
                      )}
                  </p>
                </Form.Group>
                <Form.Group controlId="eventCategory">
                  <Form.Label>Event Category</Form.Label>
                  <Form.Control
                    name="eventCategory"
                    as="select"
                    ref={register({
                      required: true,
                      validate: (value) => value !== "Pick a Category",
                    })}
                  >
                    <option>Pick a Category</option>
                    {searchCategories.map((categories) => (
                      <option name="categories" value={categories._id}>
                        {" "}
                        {categories.eventCategory}
                      </option>
                    ))}
                  </Form.Control>
                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventCategory &&
                      errors.eventCategory.type === "validate" && (
                        <span>
                          This field is required, select one of the Categories!
                        </span>
                      )}
                  </p>
                </Form.Group>

                <Form.Group controlId="eventDescription">
                  <Form.Label>Event Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="eventDescription"
                    placeholder="Event Description..."
                    ref={register({
                      required: true,
                      minLength: 10,
                      maxLength: 1200,
                    })}
                  />
                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventDescription &&
                      errors.eventDescription.type === "required" && (
                        <span>This field is required!</span>
                      )}
                    {errors.eventDescription &&
                      errors.eventDescription.type === "minLength" && (
                        <span>
                          This field requires minimum length of 10 characters!
                        </span>
                      )}
                    {errors.eventDescription &&
                      errors.eventDescription.type === "maxLength" && (
                        <span>
                          This field has limit of maximum of 1200 characters!
                        </span>
                      )}
                  </p>
                </Form.Group>
              </Col>
              <Col className="col-12 col-md-6">
                <Form.Group controlId="eventLocation">
                  <Form.Label>Event Location</Form.Label>
                  <Form.Control
                    name="eventLocation"
                    as="select"
                    ref={register({
                      required: true,
                      validate: (value) => value !== "Pick a Location",
                    })}
                  >
                    <option>Pick a Location</option>
                    {searchLocation.map((locations) => (
                      <option value={locations}>{locations}</option>
                    ))}
                  </Form.Control>
                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventLocation &&
                      errors.eventLocation.type === "validate" && (
                        <span>
                          This field is required, select one of the Locations!
                        </span>
                      )}
                  </p>
                </Form.Group>

                <Form.Group controlId="eventPrice">
                  <Form.Label>Event Price</Form.Label>
                  <Form.Control
                    name="eventPrice"
                    type="number"
                    ref={register({
                      min: 0,
                      max: 1000,
                      required: true,
                    })}
                  ></Form.Control>

                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventPrice &&
                      errors.eventPrice.type === "required" && (
                        <span>
                          This field is required! (If the event is meant to be
                          free, give the input value 0)
                        </span>
                      )}
                    {errors.eventPrice && errors.eventPrice.type === "min" && (
                      <span>Minimum value for this field is 0(free)!</span>
                    )}
                    {errors.eventPrice && errors.eventPrice.type === "max" && (
                      <span>Maximum value for this field is 1000!</span>
                    )}
                  </p>
                </Form.Group>

                <Form.Group controlId="eventTickets">
                  <Form.Label>Tickets</Form.Label>
                  <Form.Control
                    name="eventTickets"
                    type="number"
                    ref={register({
                      min: 1,
                      max: 1000,
                      required: true,
                    })}
                  ></Form.Control>

                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventTickets &&
                      errors.eventTickets.type === "required" && (
                        <span>This field is required!</span>
                      )}
                    {errors.eventTickets &&
                      errors.eventTickets.type === "min" && (
                        <span>Minimum value for this field is 1!</span>
                      )}
                    {errors.eventTickets &&
                      errors.eventTickets.type === "max" && (
                        <span>Maximum value for this field is 1000!</span>
                      )}
                  </p>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Event Start</Form.Label>
                  <Form.Control
                    name="eventStart"
                    type="date"
                    // value={eventDetails.eventStart}
                    id="start-date"
                    ref={register({
                      required: true,
                      validate: (value) => value > todayDate,
                    })}
                  />
                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventStart &&
                      errors.eventStart.type === "required" && (
                        <span>This field is required!</span>
                      )}
                    {errors.eventStart &&
                      errors.eventStart.type === "validate" && (
                        <span>
                          Starting date cant be earlier than tomorrow!
                        </span>
                      )}
                  </p>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Event End</Form.Label>
                  <Form.Control
                    name="eventEnd"
                    type="date"
                    // value={eventDetails.eventEnd}
                    id="end-date"
                    ref={register({
                      required: true,
                      // validate: (value) =>
                      //   document.getElementById("start-date").value
                      //     ? value > document.getElementById("start-date").value
                      //     : value > todayDate,
                      validate: (value) =>
                        document.getElementById("start-date").value
                          ? value >= document.getElementById("start-date").value
                          : value > todayDate,
                    })}
                  />
                  <p style={{ color: "red" }}>
                    &#8203;
                    {errors.eventEnd && errors.eventEnd.type === "required" && (
                      <span>This field is required!</span>
                    )}
                    {errors.eventEnd && errors.eventEnd.type === "validate" && (
                      <span>
                        Ending date cant be earlier than starting date!
                      </span>
                    )}
                  </p>
                </Form.Group>
              </Col>

              <Col className="col-12 col-md-6">
                <Button
                  className="create__form--submit btn-lg font-weight-bold"
                  variant="primary"
                  type="submit"
                >
                  Publish Event
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
