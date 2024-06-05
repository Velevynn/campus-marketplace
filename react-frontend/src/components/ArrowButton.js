import React from "react";
import arrow from "../assets/arrow.png";
import "./ArrowButton.css";

function ArrowButton() {
	/* To handle the onClick() prop, make a div around this element and put the onClick() there.
	 *  To handle positioning, move that styling to the div around this element
	 */
	return (
		<div className="arrow-button vertical-center">
			<img src={arrow}></img>
		</div>
	);
}

export default ArrowButton;
