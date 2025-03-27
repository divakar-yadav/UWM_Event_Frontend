import { useState } from "react";
import './index.css';
import 'tailwindcss/tailwind.css';
import CountdownTimer from './CountdownTimer';


function Login() {
  useState(() => {
    document.title = "Login";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add code to handle login submission
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      // if response is 200 (ok), store the jwt token in local storage
      // and redirect to the dashboard
      // else, display error message
      if (response.status === 200) {
        const data = await response.json();
        console.log(data,"---data-----")
        localStorage.setItem("token", data.token);
        localStorage.setItem("first_name", data.first_name);
        window.location.href = "/";
      } else {
        const p = document.getElementById("error");
        p.innerHTML = "Invalid email or password";
        p.style.color = "red";
        setLoading(false);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CountdownTimer targetDate={new Date('2023-04-22T09:00:00-05:00')} />
      <div className="min-h-screen bg-gradient-to-r from-ffbd00 to-[#eca600] flex items-center justify-center lg:-mt-16">
        <div className="bg-white shadow-md rounded-lg p-8 w-full md:w-96 lg:w-1/2 mx-4 md:mx-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-4xl font-bold text-center">Judge Login</h1>
            <p className="text-sm text-gray-600 text-center">
              Please log in using the email address you registered with. Your password is your last name followed by 2024.
            </p>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xl font-semibold">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
                id="email"
                aria-describedby="Email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xl font-semibold">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-2 border border-gray-300 rounded"
                id="password"
                aria-describedby="Password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="flex items-center mb-3">
              <input type="checkbox" onClick={handleShowPassword} className="mr-2" />
              <span className="text-sm">Show Password</span>
            </div>

            <p id="status" className="text-red-500 text-center"></p>

            <button
              className={`w-full p-2 text-white font-bold rounded ${loading ? 'bg-gray-500' : 'bg-green-500'
                }`}
              id="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
          <p id="error" className="text-red-500 mt-4"></p>
          <p className="text-sm text-gray-600 text-center mt-4">
            If you are unable to log in, please stop by the registration table.
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
