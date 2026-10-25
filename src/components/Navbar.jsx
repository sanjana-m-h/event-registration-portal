import { NavLink } from "react-router-dom";

export default function Navbar() {
  const link = ({ isActive }) => "nav-link" + (isActive ? " active fw-bold" : "");
  return (
    <nav className="navbar navbar-expand-sm navbar-dark brand-bar">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Campus Events
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink end className={link} to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/events">Events</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/registrations">Registrations</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}