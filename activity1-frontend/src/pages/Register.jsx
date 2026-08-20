import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // Client-side validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await registerUser(formData);

      setMessage(
        response.message || "Registration successful!"
      );

      setFormData({
        username: "",
        email: "",
        password: "",
      });

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>User Registration</h1>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>

        <button type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Register;