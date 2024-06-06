import React from "react";
import {useNavigate} from "react-router-dom";
import "./CategoryBar.css";

function CategoryBar() {
	const navigate = useNavigate();

	const handleCategoryClick = category => {
		navigate("/marketplace?q=" + category);
		window.location.reload();
	};

	const categoryList = [
		"Vehicles",
		"Property Rentals",
		"Apparel",
		"Classifieds",
		"Electronics",
		"Entertainment",
		"Family",
		"Free Stuff",
		"Garden & Outdoor",
		"Hobbies",
		"Home Goods",
		"Home Improvement",
		"Supplies",
		"Home Improvement Supplies",
		"Home Sales",
		"Musical Instruments",
		"Office Supplies",
		"Pet Supplies",
		"Sporting Goods",
		"Toys & Games",
		"Buy and Sell Groups",
		"Other"
	];

	const pages = [
		categoryList.map((category, index) => (
			<button
				className="category-button"
				key={index}
				onClick={() => {
					handleCategoryClick(category);
				}}
				style={{width: "fit-content"}}
			>
				{category}
			</button>
		))
	];

	return (
		<div>
			<div className="flex-container category-list">{pages}</div>
		</div>
	);
}

export default CategoryBar;
