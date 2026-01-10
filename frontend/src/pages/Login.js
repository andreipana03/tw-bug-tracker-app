import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData ({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Date incorecte");
      }

      localStorage.setItem("token", data.token);

      try {
        const decoded = jwtDecode(data.token);
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("userId", decoded.id);
        console.log("User logat cu succes:", decoded);
      } catch (err) {
        console.error("Eroare decodare token", err);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Autentificare</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} ></input>
        <input type="password" name="password" placeholder="Parola" onChange={handleChange} ></input>
        <button type="submit">Login</button>
      </form>
      <p>
        Nu ai cont? <Link to="/register">Inregistrare</Link>
      </p>
    </div>
  );
};

export default Login;
