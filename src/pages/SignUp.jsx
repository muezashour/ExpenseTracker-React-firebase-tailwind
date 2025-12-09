import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { UserContext } from "../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { googleSignIn, loading, registerWithEmail } = UserContext();

  const signInWithGoogle = async () => {
  try {
    const result = await googleSignIn();


    if (result?._tokenResponse?.isNewUser) {
      navigate("/ExpenseTracker");
    } else {
      setError("This Google account is already registered. Please sign in instead.");
    }

  } catch (error) {
    console.error("Google Sign-In failed:", error);
    setError("Google Sign-In failed. Please try again.");
  }
};

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide both email and password.");

      return;
    }
    try {
      await registerWithEmail(email, password);
      navigate("/ExpenseTracker");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Email sign-in failed");

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. ");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <h1 className="text-3xl font-bold font-serif animate-pulse">
          Loading<span className="animate-pulse">...</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div
        data-aos="fade-down"
        className="flex flex-col items-center gap-4 p-2"
      >
        <Link className="flex gap-2 items-center" to="/">
         <img rel="icon" type="image/png" src="/icons/apple-touch-icon.png" className="w-15 h-15" />
          <h2 className="font-serif font-bold cursor-pointer text-3xl tracking-wide">
            ExpenseTracker
          </h2>
        </Link>

        <h1 className="duration-300 transform transition-all hover:scale-105">
          Create your account to get started
        </h1>

        <div className="w-[340px] max-h-screen m-auto py-4 flex flex-col gap-4 items-center rounded-2xl shadow-lg opacity-90 mt-4 bg-white p-8">
          <h1 className="font-serif text-center text-3xl font-bold py-6">
            Create Account
          </h1>
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col items-center justify-between w-full"
          >
            <input
              required
              className="rounded-2xl bg-gray-100 p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              className="rounded-2xl bg-gray-100 p-2 mt-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="py-3 px-7 my-5 cursor-pointer rounded-full bg-blue-600 text-white hover:bg-blue-500 duration-300"
            >
              Sign Up
            </button>

             {error && (
              <p className="text-red-500 text-sm text-center ">{error}</p>
            )}
          </form>

          <div className="mt-2 text-center">
            <h2
              onClick={() => navigate("/SignIn")}
              className="text-sm my-2 cursor-pointer font-serif hover:underline"
            >
              Already have an account?{" "}
              <span className="duration-300 transform transition-all hover:scale-105 inline-block">
                Sign In
              </span>
            </h2>
          </div>

          <div className="flex items-center w-full text-gray-400">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-xs shadow-2xl">OR CONTINUE WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-between gap-4">
            <button onClick={signInWithGoogle} className="cursor-pointer">
              <div className="p-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FcGoogle size={35} />
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
