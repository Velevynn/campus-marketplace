import React, {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";

function HandleTokenRedirect() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get(process.env.REACT_APP_JWT_TOKEN_NAME);
		const decoded_token = decodeURIComponent(token);

		if (decoded_token) {
			localStorage.setItem(
				process.env.REACT_APP_JWT_TOKEN_NAME,
				decoded_token
			);
			navigate("/profile"); // Navigate to the profile page
		} else {
			navigate("/login"); // No token found, redirect to login
		}
	}, [location, navigate]);

	return <div>Loading...</div>;
}

export default HandleTokenRedirect;
