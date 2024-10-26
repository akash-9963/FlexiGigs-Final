import { useCookies } from "react-cookie";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../utils/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

function AuthWrapper({ type }) {
  const [cookies, setCookies] = useCookies();
  const [{ showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const router = useRouter();

  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cookies.jwt) {
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
      router.push("/dashboard");
    }
  }, [cookies, dispatch, router]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const { email, password } = values;
    setError("");

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true } // Ensure credentials are sent
      );

      const { user, jwt } = response.data;
      setCookies("jwt", { jwt });
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });

      if (user) {
        dispatch({ type: reducerCases.SET_USER, userInfo: user });
        window.location.reload();
      }
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthType = () => {
    if (type === "login") {
      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL });
    } else {
      dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL });
    }
  };

  useEffect(() => {
    const html = document.querySelector("html");
    html.style.overflowY = "hidden";

    return () => {
      html.style.overflowY = "initial";
    };
  }, [dispatch, showLoginModal, showSignupModal]);

  return (
    <div className="fixed top-0 z-[100]">
      <div className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0" id="blur-div"></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div className="fixed z-[101] h-max w-max bg-white flex flex-col justify-center items-center" id="auth-modal">
          <div className="flex flex-col justify-center items-center p-8 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              {type === "login" ? "Login" : "SignUp"} to FlexiGigs
            </h3>
            {error && <p className="text-red-500" aria-live="polite">{error}</p>}
            <div className="flex flex-col gap-5">
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="border border-slate-300 p-3 w-80"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-slate-300 p-3 w-80"
                name="password"
                onChange={handleChange}
              />
              <button
                className={`bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleClick}
                type="button"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </div>
            <p className="text-sm text-slate-600">
              {type === "login" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button 
                className="text-blue-500 underline" 
                onClick={toggleAuthType}
              >
                {type === "login" ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
