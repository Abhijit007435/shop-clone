import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      login(response.data);
      navigate("/");
    } catch (error) {
      const data = error.response?.data;

      if (data && typeof data === "object" && !data.message) {
        setFieldErrors(data);
      } else if (data?.message) {
        setGeneralError(data.message);
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Sign In</h2>

      {generalError && (
        <p style={{ color: "red", marginBottom: 12 }}>{generalError}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
          {fieldErrors.email && (
            <p style={{ color: "red", fontSize: 13 }}>{fieldErrors.email}</p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
          {fieldErrors.password && (
            <p style={{ color: "red", fontSize: 13 }}>{fieldErrors.password}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: 10 }}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}