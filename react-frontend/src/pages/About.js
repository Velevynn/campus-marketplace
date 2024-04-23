// About.js (Josh)
import React from "react";
import Bio from "../components/Bio";
import "./About.css"

function About() {
  return (
    <div>
      <h1 className="vertical-center">About</h1>
      <div className="flex-row about-layout">
        <Bio
          name="Alex"
          bio="4th Year CS Major. I like biking hiking. I like going on branch 500 commits behind then manually merging."
        />

        <Bio
          name="Alexander"
          bio="3rd Year CS Major. I am a dancer in United Movement, a non-audition dance club at Cal Poly in San Luis Obispo. Let's dance."
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
