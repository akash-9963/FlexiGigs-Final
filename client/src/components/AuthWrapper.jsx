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
  const [loading, setLoading] = useState(false); // Loading state

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
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const { email, password } = values;
    setError(""); // Reset error state

    // Validate input
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Set loading state
    try {
      const {
        data: { user, jwt },
      } = await axios.post(
        type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      setCookies("jwt", { jwt }); // Set cookie
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });

      if (user) {
        dispatch({ type: reducerCases.SET_USER, userInfo: user });
        window.location.reload();
      }
    } catch (err) {
      // Set specific error messages based on the response from the server
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false); // Reset loading state
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
            {error && <p className="text-red-500" aria-live="polite">{error}</p>} {/* Display error message */}
            <div className="flex flex-col gap-5">
              <div className="relative w-full">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="border border-slate-300 p-3 w-80"
                  onChange={handleChange}
                />
              </div>
              <div className="relative w-full">
                <input
                  type="password"
                  placeholder="Password"
                  className="border border-slate-300 p-3 w-80"
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <button
                className={`bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleClick}
                type="button"
                disabled={loading} // Disable button during loading
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </div>
          </div>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm text-slate-700">
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
                      dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
                    }}
                  >
                    Join Now
                  </span>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
                      dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
                    }}
                  >
                    Login Now
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
