import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import "./ScrollToTopButton.css"; // Import your CSS file
import ArrowButton from "./ArrowButton";

const ScrollToTopButton = ({onClick}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// Check if the user scrolled more than one page length
			if (window.scrollY > window.innerHeight / 2) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		// Add scroll event listener when component mounts
		window.addEventListener("scroll", handleScroll);

		// Clean up the event listener when component unmounts
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleClick = () => {
		onClick(); // Trigger the onClick callback when the button is clicked
	};

	return (
		<div
			className={`scrollToTopButton ${isVisible ? "show" : ""}`}
			onClick={handleClick}
		>
			<ArrowButton></ArrowButton>
		</div>
	);
};

// Prop type validation
ScrollToTopButton.propTypes = {
	onClick: PropTypes.func.isRequired // onClick should be a function and is required
};

export default ScrollToTopButton;
