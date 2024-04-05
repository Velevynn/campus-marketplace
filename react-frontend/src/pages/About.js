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
          bio="4th Year CS Major. I enjoy biking, hiking and traveling."
        />

        <Bio
          name="Alexander"
          bio="3rd Year CS Major. I am a dancer in United Movement is a non-audition dance club at Cal Poly in San Luis Obispo. Let's dance."
        />

        <Bio
          name="Joshua"
          bio="3rd Year SE Major. I enjoy Kickboxing and going to the gym."
        />

        <Bio
          name="Jimmy"
          bio="
          3rd Year CS Major. I'm a valorant player for the Cal Poly Collegiate Gaming Club."
        />

        <Bio
          name="Karan"
          bio="2nd Year SE Major. I enjoy long walks on the beach and meditating."
        />
      </div>
    </div>
  );
}

export default About;
