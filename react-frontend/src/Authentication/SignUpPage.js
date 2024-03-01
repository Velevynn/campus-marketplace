import React, { useState } from "react";
import axios from "axios";

function SignupForm() {
  const [user, setUser] = useState({
    username: "",
    full_name: "",
    password: "",
    email: "",
    phoneNum: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "phoneNum") {
      const numbers = value.replace(/\D/g, "");
      const formattedNumber = numbers.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "($1) $2-$3",
      );

      setUser({
        ...user,
        [name]: formattedNumber,
      });
    } else {
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/users/register",
        user,
      );
      if (response.status === 201) {
        alert("User successfully registered!");
        setUser({
          username: "",
          full_name: "",
          password: "",
          email: "",
          phoneNum: "",
        });
      } else {
        alert("Failed to register user.");
      }
    } catch (error) {
      console.error(
        "There was an error during the registration process:",
        error,
      );
    }
  }

  return (
    <div className="container">
      <h2>Signup Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNum">Phone Number</label>
          <input
            type="tel"
            name="phoneNum"
            id="phoneNum"
            value={user.phoneNum}
            onChange={handleChange}
            maxLength="10"
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={user.username}
            onChange={handleChange}
            maxLength="20"
            required
          />
        </div>
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            value={user.full_name}
            onChange={handleChange}
            maxLength="50"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password}
            onChange={handleChange}
            maxLength="12"
            minLength="8"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default SignupForm;
