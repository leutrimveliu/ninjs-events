import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { editEvent, getEventDetails, deleteEvent } from "../../api/editEvent";
import { useHistory, Redirect, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { getCategories, getLocation } from "../../api/filter";
import { useSelector } from "react-redux";
import "./style.scss";

const EditEvent = () => {
  let { id } = useParams();
  const history = useHistory();
  const [showEditForm, setShowEditForm] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [searchCategories, setSearchCategories] = useState([]);
  const [searchLocation, setSearchLocation] = useState([]);
  const [eventDetails, setEventDetails] = useState({});

  const getCategoriesList = async () => {
    const response = await getCategories();
    setSearchCategories(response);
  };
  const getLocationList = async () => {
    const response = await getLocation();
    setSearchLocation(response);
  };
  const getEventFields = async () => {
    const response = await getEventDetails(id);
    setEventDetails((oldDetails) => ({
      ...oldDetails,
      eventTitle: response.event.eventTitle,
      eventCategory: response.event.eventCategory,
      eventDescription: response.event.eventDescription,
      eventLocation: response.event.eventLocation,
      eventPrice: response.event.eventPrice,
      // eventTickets: response.event.eventTickets,
      startDate: response.startDate,
      endDate: response.endDate,
      user_id: response.event.user_id,
    }));
    setShowEditForm(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data) => {
    let form = new FormData();

    if (data.eventPhoto.length > 0) {
      form.append("eventPhoto", data.eventPhoto[0]);
      form.append("eventTitle", data.eventTitle);
      form.append("eventCategory", data.eventCategory);
      form.append("eventDescription", data.eventDescription);
      form.append("eventLocation", data.eventLocation);
      form.append("eventPrice", data.eventPrice);
      // form.append("eventTickets", data.eventTickets);
      form.append("eventStart", data.eventStart);
      form.append("eventEnd", data.eventEnd);
      form.append("user_id", currentUser.user._id);
    } else {
      form.append("eventTitle", data.eventTitle);
      form.append("eventCategory", data.eventCategory);
      form.append("eventDescription", data.eventDescription);
      form.append("eventLocation", data.eventLocation);
      form.append("eventPrice", data.eventPrice);
      // form.append("eventTickets", data.eventTickets);
      form.append("eventStart", data.eventStart);
      form.append("eventEnd", data.eventEnd);
      form.append("user_id", currentUser.user._id);
    }

    try {
      await editEvent(form, id);

      setTimeout(() => {
        history.push("/company/events");
      }, 1000);
      console.log("Event has been updated!");
    } catch (e) {}
  };

  const handleDeleteSubmit = async () => {
    const deleteuser = {
      user_id: currentUser.user._id,
    };
    try {
      await deleteEvent(id, deleteuser);
      console.log("Event has been deleted!");
      setTimeout(() => {
        history.push("/company/events");
      }, 1000);
    } catch (e) {}
  };
  useEffect(() => {
    getCategoriesList();
    getLocationList();
    getEventFields();
  }, [currentUser]);

  if (showEditForm) {
    if (currentUser) {
      if (
        // currentUser.role === "company" ||
        currentUser.user._id === eventDetails.user_id
      ) {
      } else {
        return <Redirect to="/" />;
      }
    } else {
      return <Redirect to="/" />;
    }
  }

  const todayDate = format(new Date(), "yyyy-MM-dd");

  return (
    <>
      <div className="form--createevent">
        <div className="form__title d-flex justify-content-center mb-5 mt-5 ">
          <h1>Edit an Event</h1>
        </div>
        <div className="d-flex justify-content-center mb-5 mt-5">
          <Form
            className="event-form col-md-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row>
              <Col className="col-12 col-md-6">
                <Form.Group controlId="eventPhoto">
                  <Form.Label>Upload an Event Photo</Form.Label>
                  <Form.File name="eventPhoto" ref={register()} />
                  <p style={{ color: "red" }}>&#8203;</p>
                </Form.Group>
                <Form.Group controlId="eventTitle">
                  <Form.Label>Event Title*</Form.Label>
                  <Form.Control
                    name="eventTitle"
                    type="text"
                    defaultValue={eventDetails.eventTitle}
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
                  <Form.Label>Event Category*</Form.Label>
                  <Form.Control
                    name="eventCategory"
                    // defaultValue={eventDetails.eventCategory}
                    value={eventDetails.eventCategory}
                    onChange={handleChange}
                    as="select"
                    ref={register({
                      required: true,
                      validate: (value) => value !== "Pick a Category",
                    })}
                  >
                    <option>Pick a Category</option>
                    {searchCategories.map((categories) => (
                      <option value={categories._id}>
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
                  <Form.Label>Event Description*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="eventDescription"
                    placeholder="Event Description..."
                    defaultValue={eventDetails.eventDescription}
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
                  <Form.Label>Event Location*</Form.Label>
                  <Form.Control
                    name="eventLocation"
                    value={eventDetails.eventLocation}
                    onChange={handleChange}
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
                    value={eventDetails.eventPrice}
                    onChange={handleChange}
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
                        <span>This field is required!</span>
                      )}
                    {errors.eventPrice && errors.eventPrice.type === "min" && (
                      <span>Minimum value for this field is 0(free)!</span>
                    )}
                    {errors.eventPrice && errors.eventPrice.type === "max" && (
                      <span>Maximum value for this field is 1000!</span>
                    )}
                  </p>
                </Form.Group>

                {/* <Form.Group controlId="eventTickets">
                  <Form.Label>Tickets</Form.Label>
                  <Form.Control
                    name="eventTickets"
                    type="number"
                    value={eventDetails.eventTickets}
                    onChange={handleChange}
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
                        <span>
                          Minimum value for this field is 1!
                        </span>
                      )}
                    {errors.eventTickets &&
                      errors.eventTickets.type === "max" && (
                        <span>
                          Maximum value for this field is 1000!
                        </span>
                      )}
                  </p>
                </Form.Group> */}

                <Form.Group>
                  <Form.Label>Event Start*</Form.Label>
                  <Form.Control
                    name="eventStart"
                    defaultValue={eventDetails.startDate}
                    type="date"
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
                  <Form.Label>Event End*</Form.Label>
                  <Form.Control
                    name="eventEnd"
                    defaultValue={eventDetails.endDate}
                    type="date"
                    id="end-date"
                    ref={register({
                      required: true,
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
                  className="btn-lg font-weight-bold"
                  variant="primary"
                  type="submit"
                >
                  Edit Event
                </Button>
              </Col>
              <Button
                className="btn-lg font-weight-bold"
                variant="danger"
                type="button"
                onClick={() => {
                  if (window.confirm("Delete the event?")) {
                    handleDeleteSubmit();
                  }
                }}
              >
                Delete Event
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditEvent;
