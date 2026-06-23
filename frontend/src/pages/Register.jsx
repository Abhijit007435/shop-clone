import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
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
      const response = await registerUser(formData);
      login(response.data); // store token + user info, mark as logged in
      navigate("/"); // redirect to home after successful registration
    } catch (error) {
      const data = error.response?.data;

      if (data && typeof data === "object" && !data.message) {
        // Field-level validation errors from GlobalExceptionHandler's MethodArgumentNotValidException case
        setFieldErrors(data);
      } else if (data?.message) {
        // Business logic errors, e.g. "email already exists"
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
      <h2>Create Account</h2>

      {generalError && (
        <p style={{ color: "red", marginBottom: 12 }}>{generalError}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
          {fieldErrors.fullName && (
            <p style={{ color: "red", fontSize: 13 }}>{fieldErrors.fullName}</p>
          )}
        </div>

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

        <div style={{ marginBottom: 12 }}>
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

        <div style={{ marginBottom: 16 }}>
          <label>Phone Number (optional)</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: 10 }}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}