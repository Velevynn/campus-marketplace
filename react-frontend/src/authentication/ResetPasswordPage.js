import React, {useState} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle} from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes
import logoImage from "../assets/haggle-horizontal.png";
import "./LoginPage.css"; // Ensure CSS is correctly linked

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get(process.env.REACT_APP_JWT_TOKEN_NAME);

	const isPasswordValid =
		password.length >= 8 &&
		/[0-9]/.test(password) &&
		/[\W_]/.test(password);

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const handlePasswordFocus = () => setPasswordFocused(true);
	const handlePasswordBlur = () => setPasswordFocused(false);

	const handleSubmit = async e => {
		e.preventDefault();
		if (!isPasswordValid) {
			alert("Password does not meet the required criteria.");
			return;
		}

		try {
			await axios.post(
				process.env.REACT_APP_BACKEND_LINK + "/users/reset-password",
				{
					token,
					password
				}
			);
			alert(
				"Password has been successfully reset. You can now login with your new password."
			);
			navigate("/login");
		} catch (error) {
			alert(
				"Failed to reset password. Please try again or request a new password reset link."
			);
		}
	};

	return (
		<div className="vertical-center margin-top">
			<div className="small-container drop-shadow">
				<form onSubmit={handleSubmit}>
					<div className="vertical-center">
						<img className="logo-img" src={logoImage} alt="Logo" />
					</div>

					<h5 className="text-center" style={{fontSize: "18px"}}>
						Reset Password
					</h5>
					<p className="text-center" style={{fontSize: "14px"}}>
						Enter your new password and check it to confirm
						it&apos;s correct.
					</p>
					<div className="margin input" style={{marginTop: "20px"}}>
						<p
							className={
								password.length > 0
									? "input-label-full"
									: "input-label-empty unselectable"
							}
						>
							New Password
						</p>
						<input
							type={passwordVisible ? "text" : "password"}
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							onFocus={handlePasswordFocus}
							onBlur={handlePasswordBlur}
							style={{paddingRight: "2.5rem"}}
							className="password-input"
						/>
						<div
							className="input-icon"
							onClick={togglePasswordVisibility}
						>
							{passwordVisible ? <FaEye /> : <FaEyeSlash />}
						</div>
					</div>
					{passwordFocused && (
						<div
							className="password-rules"
							style={{
								fontSize: "12px",
								marginTop: "20px",
								marginLeft: "20px"
							}}
						>
							<PasswordRule
								isValid={password.length >= 8}
								text="At least 8 characters"
							/>
							<PasswordRule
								isValid={/[0-9]/.test(password)}
								text="At least one number"
							/>
							<PasswordRule
								isValid={/[\W_]/.test(password)}
								text="At least one special character"
							/>
						</div>
					)}
					<button
						className={`span-button ${isPasswordValid ? "" : "disabled"}`}
						type="submit"
						style={{marginTop: "20px"}}
					>
						Reset Password
					</button>
				</form>
			</div>
		</div>
	);
};

const PasswordRule = ({isValid, text}) => (
	<div style={{color: isValid ? "green" : "red"}}>
		{isValid ? (
			<FaCheckCircle
				style={{marginRight: "8px", position: "relative", top: "2px"}}
			/>
		) : (
			<FaTimesCircle
				style={{marginRight: "8px", position: "relative", top: "2px"}}
			/>
		)}
		{text}
	</div>
);

PasswordRule.propTypes = {
	isValid: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired
};

export default ResetPasswordPage;
