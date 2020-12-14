import React from "react";
import { Row } from "react-bootstrap";
import Cards from "./Cards";
import backgroundSVG from "../../images/contact__us.svg";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
// styles
import "./about.scss";

const About = ({ filterChanged }) => {
  return (
    <>
      <Header filterChanged={filterChanged} />
      <div className="about">
        <div className="about__showcase">
          <img
            className="about__image"
            src={backgroundSVG}
            alt="programming svg"
          />
          <h1 className="about__title">Starlab ninJS ⚔</h1>
        </div>

        <div className="about__content">
          <h3 className="about__content__title">
            StarLabs offers high quality ICT outsourcing services, combining a
            number of technologies in Development, Business Process Outsourcing
            and IT managed services.
          </h3>
          <h5 className="about__content__subtitle">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the to electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum
            passages,and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </h5>
          <div />
        </div>
        <hr />
        <div className="about__team">
          <h2 className="font-weight-bold my-5">NINJS TEAM⚔</h2>
          <p className="font-weight-bold my-5">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit,
            error amet numquam iure provident voluptate esse quasi, veritatis
            totam voluptas nostrum quisquam eum porro a pariatur veniam.
          </p>
          <Row>
            <Cards
              imageUrl="https://mdbootstrap.com/img/Photos/Others/photo1.jpg"
              name="Flamur Bajra"
              info="Team Leader"
              smOne="facebook"
              smTwo="linkedin"
              smThree="twitter"
            />
            <Cards
              imageUrl="https://mdbootstrap.com/img/Photos/Others/photo2.jpg"
              name="Albionë Bajrami"
              info="Scrum Master & Web Developer"
              smOne="facebook"
              smTwo="linkedin"
              smThree="twitter"
            />
            <Cards
              imageUrl="https://mdbootstrap.com/img/Photos/Others/photo10.jpg"
              name="Fitim Bytyqi"
              info="Web Developer & Intern"
              linkUrlOne="https://www.facebook.com/fitimbyttyqi"
              linkUrlTwo="https://www.linkedin.com/in/fitim-byty%C3%A7i-6014b8178/"
              linkUrlThree="#"
              smOne="facebook"
              smTwo="linkedin"
              smThree="twitter"
            />
            <Cards
              imageUrl="https://mdbootstrap.com/img/Photos/Others/photo15.jpg"
              name="Leutrim Veliu"
              info="Web Developer & Intern"
              smOne="facebook"
              smTwo="linkedin"
              smThree="twitter"
            />
            <Cards
              imageUrl="https://mdbootstrap.com/img/Photos/Others/photo7.jpg"
              name="Lorik Aliu"
              info="Web Developer & Intern"
              smOne="facebook"
              smTwo="linkedin"
              smThree="twitter"
            />
            <Cards
              imageUrl="https://mdbootstrap.com/img/Photos/Others/photo10.jpg"
              name="Flamur Morina"
              info="Web Developer & Intern"
              smOne="facebook"
              smTwo="linkedin"
              smThree="twitter"
            />
          </Row>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
