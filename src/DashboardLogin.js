import { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

export default function DashboardLogin() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    document.title = "Dashboard Login";

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/home/validate_token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.replace("/");
        }
      })
      .catch(() => {});
  }, [API_URL]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/pa-283771828/signin/`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("first_name", res.data.first_name || "");
      window.location.replace("/");
    } catch (ex) {
      const msg = ex?.response?.data?.detail || "Login failed";
      setErr(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffbd00] to-[#eca600] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-black/10">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-center text-black">
              Dashboard Login
            </h1>
            <p className="text-sm text-gray-700 text-center mt-3">
              This login is for the SRPC dashboard only.
            </p>
            <p className="text-sm text-gray-700 text-center mt-1">
              Authorized dashboard users only.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xl font-semibold text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xl font-semibold text-black">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              onChange={() => setShowPassword((v) => !v)}
              className="mr-2"
              id="showPassword"
            />
            <label htmlFor="showPassword" className="text-sm text-black">
              Show Password
            </label>
          </div>

          {err && (
            <p className="text-red-600 text-center font-medium">
              {err}
            </p>
          )}

          <button
            className={`w-full p-3 font-bold rounded transition ${
              loading
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-5">
          If you need dashboard access, please contact the event administrator.
        </p>
      </div>
    </div>
  );
}