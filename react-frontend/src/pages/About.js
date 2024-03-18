// About.js (Josh)
import React from "react";
import "./pages.css";
import Bio from "../components/Bio";

function About() {
  return (
    <div style={{ margin: "25px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Newsreader, serif", fontSize: "3rem" }}>About</h1>
      <div className="team-container">
        <Bio
          name="Alex"
          bio="Karan likes miget"
        />

        <Bio
          name="Alexander"
          bio="lets dance"
        />

        <Bio
          name="Joshua"
          bio="fucc"
        />

        <Bio
          name="Jimmy"
          bio="
          pro valorant didnt shwer"
        />

        <Bio
          name="Karan"
          bio="yo (im cooked)"
        />
      </div>
    </div>
  );
}

export default About;
