import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Direct hit to the backend register endpoint
      await api.post("/api/register/", formData);
      alert("Account created! Now you can sign in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.response?.data);
      setError(
        err.response?.data?.error ||
          "Something went wrong. Try a different username.",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Create Account
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Join the LMS community today.
      </p>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            className="w-1/2 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-1/2 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-200"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register;
