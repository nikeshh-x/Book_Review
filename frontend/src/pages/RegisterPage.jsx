import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(form.username, form.email, form.password, form.password2);
    } catch (error) {
      setError("Registration Failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Register</h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Username"
          />

          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="password"
            value={form.password2}
            onChange={(e) => setForm({ ...form, password2: e.target.value })}
            placeholder="Confirm Password"
            className="border px-3 py-2 rounded w-full"
          />

          <button type="submit" className="bg-blue-600 w-full px-3 py-2 rounded text-white font-semibold hover:bg-blue-500">{loading ? 'Creating Account' : 'Register'}</button>
        </form>
        <p className="text-center text-md mt-4 text-gray-600">
          Already have an Account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
