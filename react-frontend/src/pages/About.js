// About.js (Josh)
import React from "react";
import "./pages.css";
import Bio from "../components/Bio";

function About() {
  return (
    <div style={{ margin: "25px", textAlign: "center" }}>
      <h style={{ fontFamily: "Newsreader, serif", fontSize: "3rem" }}>About</h>
      <div className="divider" />
      <div className="team-container">
        <Bio
          name="Alex"
          bio="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        />

        <Bio
          name="Alexander"
          bio="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        />

        <Bio
          name="Joshua"
          bio="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        />

        <Bio
          name="Jimmy"
          bio="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        />

        <Bio
          name="Karan"
          bio="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        />
      </div>
    </div>
  );
}

export default About;
