import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { format } from "date-fns";
import { getSingleEvent, getEventAndBooking } from "../../../api/event";
import { useSelector } from "react-redux";
import { deleteEvent, approveEvent } from "../../../api/editEvent";

// css
import "./style.scss";

const EventSingle = ({ user_id }) => {
  let { id } = useParams();
  const history = useHistory();
  const [notApprovedEvents, setNotApprovedEvents] = useState([]);

  const { user: currentUser } = useSelector((state) => state.auth);
  const [eventDetails, setEventDetails] = useState([]);
  const [time, setTime] = useState([]);
  // const [ticketButton, setTicketButton] = useState(false);
  const [ticketButton, setTicketButton] = useState(true);
  const [eventPrice, setEventPrice] = useState(null);
  const [eventPriceSign, setEventPriceSign] = useState("");

  const getEventsList = async () => {
    if (currentUser) {
      const user = {
        user_id: currentUser.user._id,
      };

      const response = await getEventAndBooking(id, user);
      console.log(response);

      const filteredNotApprovedEvents = response.event.isApproved;
      setNotApprovedEvents(filteredNotApprovedEvents);

      const data1 = new Date(response.event.startDate);
      const data2 = format(new Date(data1), "MMMMMM dd yyyy");
      const data = { ...response.event, startDate: data2 };
      setEventDetails(data);
      setTicketButton(response.message);

      if (response.event.eventPrice === 0) {
        setEventPrice("Free");
        setEventPriceSign("");
      } else {
        setEventPrice(response.event.eventPrice);
        setEventPriceSign(" $");
      }
    } else {
      const response = await getEventAndBooking(id);

      const data1 = new Date(response.event.startDate);
      const data2 = format(new Date(data1), "MMMMMM dd yyyy");
      const data = { ...response.event, startDate: data2 };
      setEventDetails(data);
      setTicketButton(response.message);

      if (response.event.eventPrice === 0) {
        setEventPrice("Free");
        setEventPriceSign("");
      } else {
        setEventPrice(response.event.eventPrice);
        setEventPriceSign(" $");
      }
    }
  };

  const getTime = async () => {
    const response = await getSingleEvent(id);
    const data1 = new Date(response.startDate);
    const data = {
      ...response,
      startDate: data1.toUTCString().slice(0, data1.toUTCString().length - 13),
    };
    setTime(data);
  };
  const handleApprove = async (id) => {
    const deleteuser = {
      user_id: currentUser.user._id,
    };
    try {
      await approveEvent(id, deleteuser);

      console.log("Event has been approved!");
      setTimeout(() => {
        history.push("/admin/currentRequests");
      }, 500);
    } catch (e) {}
  };
  const handleDeleteSubmit = async (id) => {
    const deleteuser = {
      user_id: currentUser.user._id,
    };
    try {
      await deleteEvent(id, deleteuser);

      console.log("Event has been deleted!");
      setTimeout(() => {
        history.push("/admin/currentRequests");
      }, 500);
    } catch (e) {}
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   // setEventPrice({ ...eventPrice, [name]: value });
  //   setEventPrice({ [name]: value });
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    getEventsList();
    getTime();
  }, []);

  let buttons;
  if (currentUser) {
    if (currentUser.role.includes("user")) {
      if (eventDetails) {
        if (ticketButton) {
          buttons = <p>You already have booked this event!</p>;
        } else {
          buttons = (
            <>
              {/* <input type="number" name="quantity" onChange={handleChange} defaultValue={1} /> */}
              {/* <input type="number" name="quantity" onChange={handleChange} /> */}
              {/* <input type="number" name="quantity" defaultValue={1} onChange={(e) => setEventPrice((e.target.value) * eventPricePH)} /> */}
              {/* <span>{!eventPrice ? eventPricePH : eventPrice}</span> */}
              <Link to={`/createpayment/${eventDetails._id}`}>
                <button className="btn btn-lg w-75 d-block mx-auto btn-success">
                  Ticket
                </button>
              </Link>
            </>
          );
        }
      }
    } else {
      buttons = "";
    }
  }

  return (
    <>
      <div className="single__event">
        {/* <div className="event__banner"></div> */}
        <div className="card__container">
          <Row>
            <Col className="img__wrapper" lg={8} md={12}>
              <img
                className="event__image"
                src={`http://localhost:4000/assets/uploads/${eventDetails.eventPhoto}`}
                alt="event img placeholder"
              />
            </Col>
            <Col lg={4} md={12}>
              <div className="event__info">
                <div className="event__innerInfo">
                  <div className="event__month">{eventDetails.startDate}</div>
                  <div className="event__location">
                    <strong>Tickets left: {eventDetails.eventTickets}</strong>
                  </div>
                </div>
                <div className="event__title">
                  <h2>{eventDetails.eventTitle}</h2>
                </div>
                <span className="event__price">
                  {eventPrice}
                  {eventPriceSign}
                </span>
              </div>
            </Col>
          </Row>

          <Row className="row">
            <Col lg={8} md={12}>
              <div className="share__link">
                {/* {editBtn} */}
                {/* <div className="share__link"></div> */}
                {/* <a href="#">SHARE</a> */}
                {/* <FacebookShareButton openShareDialogOnClick>
                  <FacebookIcon size={35} />
                </FacebookShareButton> */}

                {currentUser && currentUser.role.includes("admin") ? (
                  <>
                    <Button
                      variant="danger"
                      color="secondary"
                      onClick={() => {
                        if (window.confirm("Delete the event?")) {
                          handleDeleteSubmit(eventDetails._id);
                        }
                      }}
                      className="delete_button"
                      aria-label="delete"
                    >
                      Decline
                    </Button>
                  </>
                ) : (
                  ""
                )}
                {currentUser &&
                currentUser.role.includes("admin") &&
                !notApprovedEvents ? (
                  <Button
                    variant="success"
                    onClick={() => {
                      if (window.confirm("Approve the event?")) {
                        handleApprove(eventDetails._id);
                      }
                    }}
                    className="approve_button"
                    aria-label="approve"
                  >
                    Approve
                  </Button>
                ) : (
                  <></>
                )}

                {/* // approvedEvents ? ( */}

                {/* <Button
                      variant="success"
                      onClick={() => {
                        if (window.confirm("Approve the event?")) {
                          handleApprove(eventDetails._id);
                        }
                      }}
                      className="approve_button"
                      aria-label="approve"
                    >
                      Approve
                    </Button> */}

                {/* {approve} */}
              </div>
            </Col>
            <Col lg={4} md={12}>
              {buttons}
            </Col>
          </Row>
          <hr />

          <Row>
            <Col className="event__description" lg={8} md={12}>
              <div className="event__title">
                <h1>{eventDetails.eventTitle}</h1>
              </div>
              <div className="event__description__text">
                <h2>About this Event</h2>
                <p>{eventDetails.eventDescription}</p>
              </div>
            </Col>
            <Col className="p-3" lg={4} md={12}>
              <div className="event__time my-4">
                <p>
                  <strong>Date and Time</strong> <br />
                  {time.startDate}
                </p>
              </div>
              <div className="event__location my-4">
                <p>
                  <strong>Location</strong> <br />
                  {eventDetails.eventLocation}
                </p>
              </div>

              <div className="event__policy my-4">
                <p>
                  <strong>Refund Policy</strong> <br />
                  Contact the organizer to request a refund. ninJS's fee is
                  nonrefundable.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default EventSingle;
