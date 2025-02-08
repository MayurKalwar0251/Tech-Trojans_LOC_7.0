import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "../constant.jsx";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(`${BACKEND_URL}/user/`);
      const response = await axios.post(`${BACKEND_URL}/user/login`, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        // Store the token in a cookie
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "none",
        });

        console.log("User Created Successfully:", user);
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Login In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
