import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        ShopClone
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        {isAuthenticated && (
          <>
            <Link to="/cart">Cart</Link>

            <Link to="/orders">Orders</Link>
{user?.roles?.includes("ROLE_ADMIN") && (
  <Link to="/admin/orders">
    Admin Orders
  </Link>
)}
            <span className="welcome">
              Hi, {user.fullName}
            </span>

            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}

      </div>

    </nav>
  );
}