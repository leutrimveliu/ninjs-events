import React from "react";
import { Card } from "react-bootstrap";
import "./Cards.scss";

// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fab);

const Cards = ({
  imageUrl,
  name,
  info,
  linkUrlOne,
  linkUrlTwo,
  linkUrlThree,
  smOne,
  smTwo,
  smThree,
}) => {
  return (
    <Card className="card">
      <Card.Img className="card__image" variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title className="card__title">{name}</Card.Title>
        <Card.Text>{info}</Card.Text>
        <a href={linkUrlOne} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            className="card__icon"
            icon={["fab", `${smOne}`]}
            size="lg"
          />
        </a>
        <a href={linkUrlTwo} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            className="card__icon"
            icon={["fab", `${smTwo}`]}
            size="lg"
          />
        </a>
        <a href={linkUrlThree} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            className="card__icon"
            icon={["fab", `${smThree}`]}
            size="lg"
          />
        </a>
      </Card.Body>
    </Card>
  );
};

export default Cards;
