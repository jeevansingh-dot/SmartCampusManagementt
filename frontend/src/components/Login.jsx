import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

const Login = () => {
  const [role, setRole] = useState(null);
  const [erpId, setErpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await API.post("/users/login", {
        erpId: erpId.trim().toUpperCase(),
        password,
      });

      if (res.data.success) {
        const user = res.data.user;

        localStorage.setItem("user", JSON.stringify(user));

        // ADMIN LOGIN
        if (role === "admin") {
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            localStorage.removeItem("user");
            setError("This account is not an Admin account.");
          }
        }

        // STUDENT LOGIN
        else {
          if (user.role !== "admin") {
            navigate("/student");
          } else {
            localStorage.removeItem("user");
            setError("Please select Admin to login with this account.");
          }
        }
      }
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STUDENT / ADMIN SELECTION
  // ==========================================

  if (!role) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f4f6f9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            width: "380px",
            padding: "40px 30px",
            borderRadius: "14px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#1d3557",
              marginBottom: "8px",
            }}
          >
            CampusConnect AI
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: "30px",
            }}
          >
            Smart Campus Management System
          </p>

          <h2
            style={{
              marginBottom: "22px",
              color: "#333",
            }}
          >
            Login As
          </h2>

          {/* STUDENT BUTTON */}

          <button
            onClick={() => {
              setRole("student");
              setError("");
            }}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              border: "none",
              borderRadius: "8px",
              background: "#1d3557",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            👨‍🎓 Student
          </button>

          {/* ADMIN BUTTON */}

          <button
            onClick={() => {
              setRole("admin");
              setError("");
            }}
            style={{
              width: "100%",
              padding: "15px",
              border: "1px solid #1d3557",
              borderRadius: "8px",
              background: "white",
              color: "#1d3557",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🛡️ Admin
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGIN FORM
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          width: "380px",
          padding: "35px 30px",
          borderRadius: "14px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => {
            setRole(null);
            setError("");
            setErpId("");
            setPassword("");
            setShowPassword(false);
          }}
          style={{
            border: "none",
            background: "none",
            color: "#457b9d",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "15px",
            padding: 0,
          }}
        >
          ← Back
        </button>

        {/* TITLE */}

        <h2
          style={{
            textAlign: "center",
            color: "#1d3557",
            marginBottom: "5px",
          }}
        >
          {role === "student"
            ? "👨‍🎓 Student Login"
            : "🛡️ Admin Login"}
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: "25px",
          }}
        >
          Enter your credentials
        </p>

        {/* ERROR */}

        {error && (
          <p
            style={{
              color: "#e63946",
              background: "#ffe5e5",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "14px",
              marginBottom: "18px",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          {/* ERP ID */}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#333",
              fontWeight: "500",
            }}
          >
            ERP ID
          </label>

          <input
            type="text"
            placeholder="Enter ERP ID"
            value={erpId}
            onChange={(e) => setErpId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "18px",
              boxSizing: "border-box",
              border: "1px solid #ccd6e0",
              borderRadius: "7px",
              outline: "none",
              fontSize: "14px",
            }}
          />

          {/* PASSWORD */}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#333",
              fontWeight: "500",
            }}
          >
            Password
          </label>

          <div
            style={{
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 45px 12px 12px",
                boxSizing: "border-box",
                border: "1px solid #ccd6e0",
                borderRadius: "7px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            {/* EYE BUTTON */}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "7px",
              background: loading
                ? "#8a9aaa"
                : "#1d3557",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;