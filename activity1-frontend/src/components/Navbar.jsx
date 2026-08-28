import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>React Authentication</h2>

      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;