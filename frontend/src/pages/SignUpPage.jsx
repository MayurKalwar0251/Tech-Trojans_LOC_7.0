import React, { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant.jsx";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = ["Inspector", "Constable", "Citizen", "Station"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${BACKEND_URL}/user/`, formData, {
        withCredentials: true,
      });


      const result = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 2000);
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-[800px] h-auto p-12 bg-white rounded-2xl shadow-xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 tracking-tight">
            Create Account
          </h1>
          <p className="mt-3 text-gray-500 text-lg">Enter your details to register</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-base font-semibold text-gray-800">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 text-base rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all duration-200 ease-in-out bg-gray-50 hover:bg-gray-50/80"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-base font-semibold text-gray-800">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 text-base rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all duration-200 ease-in-out bg-gray-50 hover:bg-gray-50/80"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="relative space-y-3">
            <label className="block text-base font-semibold text-gray-800">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-5 py-4 text-base rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all duration-200 ease-in-out bg-gray-50 hover:bg-gray-50/80"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-base font-semibold text-gray-800">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-5 py-4 text-base rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all duration-200 ease-in-out bg-gray-50 hover:bg-gray-50/80"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="relative space-y-3">
            <label className="block text-base font-semibold text-gray-800">Role</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-5 py-4 text-base rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all duration-200 ease-in-out bg-gray-50 hover:bg-gray-50/80 flex justify-between items-center"
              >
                {formData.role || "Select Role"}
                <ChevronDown size={20} />
              </button>
              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border rounded-lg mt-2 shadow-lg z-10">
                  {roles.map((role) => (
                    <li
                      key={role}
                      className="p-3 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, role });
                        setIsDropdownOpen(false);
                      }}
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-5 py-4 text-base font-semibold text-white cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:bg-gradient-to-r from-purple-300 to-blue-200 transition-all duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          {/* Sign In Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already a user?{" "}
              <button
                type="button"
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
