import React, { useState, useEffect } from "react";
import { addPayment } from "../../api/payment";
import { getEventAndBooking } from "../../api/event";
import { Redirect, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

// css
import "./CreatePayment.scss";

const CreatePayment = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [errMessage, setErrMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  let { id } = useParams();

  const [eventDetails, setEventDetails] = useState([]);
  const [eventPricePH, setEventPricePH] = useState(null);
  const [eventPrice, setEventPrice] = useState(null);
  const [eventPriceSign, setEventPriceSign] = useState("");

  const getEventsList = async () => {
    const response = await getEventAndBooking(id);
    setEventDetails(response);

    if (response.event.eventPrice === 0) {
      setEventPricePH("Free");
      setEventPriceSign("");
    } else {
      setEventPricePH(response.event.eventPrice);
      setEventPriceSign(" $");
    }
  };

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data, e) => {
    const payment = {
      name: data.name,
      lastName: data.lastName,
      cardNo: data.cardNo,
      address: data.address,
      city: data.city,
      stateCountry: data.stateCountry,
      zipCode: data.zipCode,
      user_id: currentUser.user._id,
      event_id: id,
      tickets: data.tickets,
    };

    try {
      const response = await addPayment(payment);
      console.log(response);

      e.target.reset();
      setErrMessage(response.errMessage);
      setSuccessMessage(response.successMessage);
    } catch (e) {}
  };

  useEffect(() => {
    getEventsList();
  }, []);

  if (currentUser) {
    if (
      currentUser.role.includes("company") ||
      currentUser.role.includes("admin")
    ) {
      return <Redirect to="/" />;
    }
  } else {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Header />
      <div className="payment__form">
        <div className="form__title d-flex justify-content-center my-5">
          <h1>Fill in your Details</h1>
        </div>
        <div className="form__title d-flex justify-content-center my-5">
          {errMessage && <Alert severity="error">{errMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </div>
        <div className="d-flex justify-content-center my-5">
          <Form
            className="payment__form col-md-8"
            onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group
                className="payment__form__group"
                as={Col}
                controlId="formBasicEmail">
                <Form.Label className="payment__form__label d-flex align-items-end">
                  Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name..."
                  name="name"
                  // value={paymentDetails.name}
                  ref={register({ required: true, minLength: 3 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.name && errors.name.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.name && errors.name.type === "minLength" && (
                    <span>
                      This field requires minimum length of 3 characters!
                    </span>
                  )}
                </p>
              </Form.Group>

              <Form.Group className="payment__form__group" as={Col}>
                <Form.Label className="payment__form__label d-flex align-items-end">
                  Last Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name..."
                  name="lastName"
                  // value={paymentDetails.lastName}
                  ref={register({ required: true, minLength: 3 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.lastName && errors.lastName.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.lastName && errors.lastName.type === "minLength" && (
                    <span>
                      This field requires minimum length of 3 characters!
                    </span>
                  )}
                </p>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group className="payment__form__group" as={Col} md={1}>
                <Form.Label className="payment-form__label d-flex align-items-center justify-content-center">
                  &#8203;
                </Form.Label>
                {/* <Form.Label className="payment-form__price d-flex align-items-end"> */}
                <Form.Label className="payment-form__price d-flex align-items-center justify-content-center">
                  {!eventPrice ? eventPricePH : eventPrice}
                  {eventPriceSign}
                </Form.Label>
              </Form.Group>
              <Form.Group
                className="payment__form__group"
                as={Col}
                md={2}
                sm={true}>
                <Form.Label className="payment__form__label d-flex align-items-end">
                  {/* Nr. of Tickets: */}
                  Tickets:
                </Form.Label>
                <Form.Control
                  type="number"
                  name="tickets"
                  // value={paymentDetails.tickets}
                  defaultValue={1}
                  onChange={(e) => setEventPrice(e.target.value * eventPricePH)}
                  ref={register({ required: true, min: 1, max: 20 })}
                  // ref={register({ required: true, min: 1, max: maxNumber })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.tickets && errors.tickets.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.tickets && errors.tickets.type === "min" && (
                    <span>This field requires minimum value of 1!</span>
                  )}
                  {errors.tickets && errors.tickets.type === "max" && (
                    <span>
                      {/* Maximum number of tickets you can purchase is 20! */}
                      This field requires maximum value of 20!
                    </span>
                  )}
                </p>
              </Form.Group>
              {/* <Form.Group className="payment__form__group" as={Col} md={1}> */}
              <Form.Group className="payment__form__group" as={Col} md={4}>
                <Form.Label className="payment__form__label d-flex align-items-end">
                  Card Number:
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Card number..."
                  name="cardNo"
                  // value={paymentDetails.cardNo}
                  ref={register({
                    required: true,
                    minLength: 16,
                    maxLength: 20,
                  })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.cardNo && errors.cardNo.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.cardNo && errors.cardNo.type === "minLength" && (
                    <span>
                      This field requires minimum length of 16 characters!
                    </span>
                  )}
                  {errors.cardNo && errors.cardNo.type === "maxLength" && (
                    <span>
                      This field requires maximum length of 20 characters!
                    </span>
                  )}
                </p>
              </Form.Group>

              <Form.Group className="form__group" as={Col}>
                <Form.Label className="payment-form__label d-flex align-items-end">
                  Address:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address..."
                  name="address"
                  // value={paymentDetails.address}
                  ref={register({ required: true, minLength: 6 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.address && errors.address.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.address && errors.address.type === "minLength" && (
                    <span>
                      This field requires minimum length of 6 characters!
                    </span>
                  )}
                </p>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group className="payment__form__group" as={Col}>
                <Form.Label className="payment__form__label d-flex align-items-end">
                  City:
                </Form.Label>
                <Form.Control
                  placeholder="City..."
                  name="city"
                  // value={paymentDetails.city}
                  ref={register({ required: true, minLength: 3 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.city && errors.city.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.city && errors.city.type === "minLength" && (
                    <span>
                      This field requires minimum length of 3 characters!
                    </span>
                  )}
                </p>
              </Form.Group>

              <Form.Group className="payment__form__group" as={Col}>
                <Form.Label className="payment__form__label d-flex align-items-end">
                  State:
                </Form.Label>
                <Form.Control
                  placeholder="State..."
                  name="stateCountry"
                  // value={paymentDetails.stateCountry}
                  ref={register({ required: true, minLength: 4 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.stateCountry &&
                    errors.stateCountry.type === "required" && (
                      <span>This field is required!</span>
                    )}
                  {errors.stateCountry &&
                    errors.stateCountry.type === "minLength" && (
                      <span>
                        This field requires minimum length of 4 characters!
                      </span>
                    )}
                </p>
              </Form.Group>

              <Form.Group
                className="payment__form__group"
                as={Col}
                controlId="formGridZip">
                <Form.Label
                  className="payment__form__label d-flex align-items-end"
                  required>
                  Zip Code:
                </Form.Label>
                <Form.Control
                  placeholder="Zip Code..."
                  name="zipCode"
                  // value={paymentDetails.zipCode}
                  ref={register({ required: true, minLength: 4, maxLength: 6 })}
                />
                <p style={{ color: "red" }}>
                  &#8203;
                  {errors.zipCode && errors.zipCode.type === "required" && (
                    <span>This field is required!</span>
                  )}
                  {errors.zipCode && errors.zipCode.type === "minLength" && (
                    <span>
                      This field requires minimum length of 4 characters!
                    </span>
                  )}
                  {errors.zipCode && errors.zipCode.type === "maxLength" && (
                    <span>
                      This field requires maximum length of 6 characters!
                    </span>
                  )}
                </p>
              </Form.Group>
            </Form.Row>

            <Button
              className="payment__form__submit btn-lg font-weight-bold"
              variant="primary"
              type="submit"
              // onClick={handleSubmit}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CreatePayment;
