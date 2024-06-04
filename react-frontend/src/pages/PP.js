import React from "react";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";

function Pp() {
	return (
		<div>
			<div className="vertical-center">
				<div className="medium-container drop-shadow margin-top">
					<head>
						<title>Privacy Policy</title>
					</head>
					<body>
						<h1>Privacy Policy</h1>
						<p>Last updated: [Date]</p>
						<p>Welcome to [Your Website]! This Privacy Policy explains how we collect, use, disclose, and protect personal information when you use our website, mobile applications, and services (collectively, the &quot;Services&quot;). By accessing or using the Services, you agree to the terms of this Privacy Policy.</p>
						<h2>Information We Collect</h2>
						<p><strong>Users:</strong></p>
						<ul>
							<li>When you sign up for an account, we collect your email address, username, and phone number.</li>
							<li>Optionally, users may provide their location (hometown city) in their profile.</li>
						</ul>
						<p><strong>Listings:</strong></p>
						<ul>
							<li>Listings provided by users may contain personal information such as descriptions, images, and pricing information.</li>
						</ul>
						<h2>How We Use Your Information</h2>
						<ul>
							<li>We use the information we collect to provide, maintain, and improve the Services, including user authentication and communication.</li>
							<li>User location information, if provided, may be used to enhance user experience and provide location-based services.</li>
							<li>We do not sell or rent your personal information to third parties.</li>
						</ul>
						<h2>Data Security</h2>
						<ul>
							<li>We take reasonable measures to protect the security of your personal information.</li>
							<li>Passwords are properly hashed before storing them in our secured database.</li>
						</ul>
						<h2>OAuth Sign Up</h2>
						<ul>
							<li>We offer OAuth sign-up through Google. By using this feature, you agree to Google&apos;s data policies.</li>
						</ul>
						<h2>Listings</h2>
						<ul>
							<li>Listings provided by users are publicly visible and may contain personal information. Users are responsible for the accuracy and legality of the listings they create.</li>
						</ul>
						<h2>Chat Feature</h2>
						<ul>
							<li>We are adding a chat feature to facilitate communication between users. Messages sent through the chat feature may be stored for record-keeping purposes.</li>
						</ul>
						<h2>Changes to this Privacy Policy</h2>
						<ul>
							<li>We may update this Privacy Policy from time to time. The latest version will be posted on our website with the effective date.</li>
						</ul>
						<h2>Contact Us</h2>
						<p>If you have any questions or concerns about this Privacy Policy, please contact us at [Contact Information].</p>
					</body>
				</div>
			</div>
			<Footer/>
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

export default Pp;
