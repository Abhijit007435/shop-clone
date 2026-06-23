import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#131921",
        color: "white",
      }}
    >
      <Link to="/" style={{ color: "white", fontWeight: "bold", fontSize: 20, textDecoration: "none" }}>
        ShopClone
      </Link>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {isAuthenticated ? (
          <>
            <span>Hi, {user.fullName}</span>
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}