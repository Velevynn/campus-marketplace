// About.js (Josh)
import React from "react";
import Bio from "../components/Bio";

function About() {
  return (
    <div>
      <h1 className="vertical-center">About</h1>
      <div className="flex-row">
        <Bio
          name="Alex"
          bio="4th Year CS Major. I like biking hiking. I like going on branch 500 commits behind then manually merging."
          className="small-container"
        />

        <Bio
          name="Alexander"
          bio="3rd Year CS Major. I am a dancer in United Movement is a non-audition dance club at Cal Poly in San Luis Obispo. Let's dance."
        />

        <Bio
          name="Joshua"
          bio="3rd Year SE Major. I like Kickboxing and going Jim"
        />

        <Bio
          name="Jimmy"
          bio="
          3rd Year CS Major. I'm pro valorant and being the best around in Collegiate Valorant Tourneys."
        />

        <Bio
          name="Karan"
          bio="2nd Year SE Major (im cooked)"
        />
      </div>
    </div>
  );
}

export default About;
