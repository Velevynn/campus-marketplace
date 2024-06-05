import React, {useState, useEffect} from "react";
import axios from "axios";
import {useSearchParams, useLocation, useNavigate} from "react-router-dom";
import Entry from "../components/MarketplaceEntry";
import ScrollToTopButton from "../components/ScrollToTopButton";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the loading spinner component
import ArrowButton from "../components/ArrowButton";

function Marketplace() {
	const [searchParams] = useSearchParams();
	let q = searchParams.get("q");
	const [entries, setEntries] = useState([]);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true); // Add loading state
	const [query, setQuery] = useState("");
	const location = useLocation();
	const navigate = useNavigate();

	const getQueryFromURL = () => {
		const search = location.search; // save query string
		if (search.startsWith("?q=")) {
			const queryString = search.substring(3); // truncate to remove '?q='
			return decodeURIComponent(queryString); // converts ASCII codes for spaces and other special characters
		}
		return ""; // return nothing if there's no query
	};

	if (q === null) {
		q = "";
	}

	useEffect(() => {
		fetchEntries();
		const initialQuery = getQueryFromURL();
		setQuery(initialQuery);
		console.log("hello: ", query);
	}, [q, page, location]);

	async function fetchEntries() {
		try {
			const response = await axios.get(
				process.env.REACT_APP_BACKEND_LINK +
					`/listings?q=${q}&page=${page}`
			);
			if (response !== "") {
				console.log(response.data);
				setEntries(prevEntries => [...prevEntries, ...response.data]); // Append fetched entries to existing ones
				setIsLoading(false); // Set loading state to false once entries are fetched
			}
		} catch (error) {
			console.log("Error fetching entries:", error);
		}
	}

	const handleScroll = () => {
		const windowHeight =
			"innerHeight" in window
				? window.innerHeight
				: document.documentElement.offsetHeight;
		const body = document.body;
		const html = document.documentElement;
		const docHeight = Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight
		);
		const windowBottom = windowHeight + window.scrollY;

		if (windowBottom >= docHeight) {
			setPage(prevPage => prevPage + 1);
			console.log("new page detected");
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div>
			{q && (
				<div
					className="left-container"
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "-50px"
					}}
				>
					<div
						onClick={() => {
							navigate("/marketplace");
							window.location.reload();
						}}
						style={{rotate: "-90deg"}}
					>
						<ArrowButton></ArrowButton>
					</div>
					<h1 style={{marginBottom: "40px", paddingLeft: "10px"}}>
						{query}
					</h1>
				</div>
			)}

			<div className="full-container">
				{isLoading ? ( // Render loading spinner if isLoading is true
					<div className="margin">
						<LoadingSpinner />
					</div>
				) : entries.length === 0 ? (
					<div>
						<h2>No Search Results</h2>
						<h1>💀</h1>
					</div>
				) : (
					entries.map(entry => (
						<Entry
							key={entry.listingID}
							title={entry.title}
							price={entry.price}
							listingID={Number(entry.listingID)}
						/>
					))
				)}
			</div>
			<ScrollToTopButton onClick={scrollToTop} />
		</div>
	);
}

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
};

export default Marketplace;
