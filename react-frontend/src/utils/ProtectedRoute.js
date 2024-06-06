// ProtectedRoute.js
import React from "react";
import PropTypes from "prop-types";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children}) => {
	const isAuthenticated =
		localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_NAME) !== null;
	if (isAuthenticated == false) {
		return <Navigate to="/login" />;
	}
	console.log(children);
	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired // Ensure children prop is provided and is a node
};

export default ProtectedRoute;
