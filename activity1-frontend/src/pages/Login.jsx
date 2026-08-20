import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Client-side validation
    if (!formData.username || !formData.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await loginUser(formData);

      console.log(response);

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>User Login</h1>

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
          Login
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default Login;