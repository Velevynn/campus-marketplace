// About.js (Josh)
import React from "react";
import Bio from "../components/Bio";
import "./About.css"
import defaultPfp from "../assets/default-pfp.jpg";
import jimmypfp from "../assets/jimmypfp.jpg";

function About() {
  return (
    <div>
      <h1 className="vertical-center margin-top">About</h1>
      <div className="about-layout margin-top">
        <Bio
          name="Alex"
          bio="4th Year CS Major. I like biking hiking. I like going on branch 500 commits behind then manually merging."
          pfp={defaultPfp}
        />

        <Bio
          name="Alexander"
          bio="3rd Year CS Major. I am a dancer in United Movement, a non-audition dance club at Cal Poly in San Luis Obispo. Let's dance."
          pfp={defaultPfp}
        />

        <Bio
          name="Joshua"
          bio="3rd Year SE Major. I enjoy Kickboxing and going to the gym."
          pfp={defaultPfp}
        />

        <Bio
          name="Jimmy"
          bio="3rd Year CS Major. I'm a D1 athlete for the Cal Poly Valorant Club."
          pfp={jimmypfp}
        />

        <Bio
          name="Karan"
          bio="2nd Year SE Major. I enjoy long walks on the beach and meditating."
          pfp={defaultPfp}
        />
      </div>
    </div>
  );
}

export default About;
