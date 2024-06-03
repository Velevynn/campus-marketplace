import React from "react";
import Bio from "../components/Bio";
import Footer from "../components/Footer";
import "./About.css";

function About() {
	const bios = [
		{
			name: "Alex",
			bio: "4th Year CS Major. I like biking hiking.",
			quip: "I like going on branch 500 commits behind then manually merging."
		},
		{
			name: "Alexander",
			bio: "3rd Year CS Major. I am a dancer in United Movement, a non-audition dance club at Cal Poly in San Luis Obispo.",
			quip: "Let's boogie"
		},
		{
			name: "Joshua",
			bio: "3rd Year SE Major. I enjoy Kickboxing and going to the gym.",
			quip: "I asked ChatGPT how to tie my shoes this morning."
		},
		{
			name: "Jimmy",
			bio: "3rd Year CS Major. I'm a D1 valorant player for the Cal Poly Collegiate Gaming Club.",
			quip: "I practice good posture to maximize my mewing and crosshair placement."
		},
		{
			name: "Karan",
			bio: "2nd Year SE Major. I enjoy long walks on the beach and meditating.",
			quip: "Brother, I'm Cooked"
		}
	];

	return (
		<div>
			<h1 className="vertical-center margin">About Us</h1>
			<div className="about-layout">
				{bios.map((bio, index) => (
					<Bio key={index} name={bio.name} bio={bio.bio} quip={bio.quip}/>
				))}
			</div>
			<Footer/>
		</div>
	);
}

export default About;
