import { FcGoogle } from "react-icons/fc";
import { FaWallet } from "react-icons/fa";
import { MdWavingHand } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { UserContext } from "../context/AuthContext";
import toast from "react-hot-toast";


const SignIn = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  const { googleSignIn, loading, signInWithEmail, user } = UserContext();
    const signInWithGoogle = async () => {
  setError(null);
  try {
    await googleSignIn();
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
        await signInWithEmail(email, password);
    }  catch (err) {
  console.error("Sign-in error:", err);

  if (err.code === "auth/user-not-found") {
    setError("This email is not registered. Please sign up first.");
  } else if (err.code === "auth/wrong-password") {
    setError("Incorrect password. Please try again.");
  } else if (err.code === "auth/invalid-credential") {
    setError("Invalid email or password. Please  sign up first.");
  } else {
    setError(err?.message || "Email sign-in failed. Please try again.");
  }
}
     };
  useEffect(() => {
    if (!user) return;

    const userName =
      user.displayName ||
      (user.email ? user.email.split("@")[0] : "User");

    const isMobile = window.innerWidth < 640;

    if (isMobile) {

      toast.success("", {
        icon: (
          <MdWavingHand size={106} className="text-blue-600 animate-bounce" />
        ),
        position: "center",
        duration: 1200,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      });
    } else {
      toast.success(`Welcome, ${userName} 👋`, {
        position: "bottom-right",
        duration: 3000,
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
         <h1 className="text-3xl font-bold font-serif animate-pulse">
          {/* <FaSpinner className="text-6xl text-gray-400 animate-spin " /> */}
          <img
            src="/icons/last192.png"
            alt="app icon"
            className="w-40 h-40 animate-[pulse_1s_ease-in-out_infinite] "
          />
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-9">
      {/* Header */}
      <div
        data-aos="fade-down"
        className="flex flex-col items-center gap-4  p-2   "
      >
        <Link className="flex gap-2 items-center" to="/">
          <img src="icons/apple-touch-icon.png" className="w-15 h-15" />
          <h2
            className="font-serif font-bold
        cursor-pointer text-3xl tracking-wide "
          >
            Walletly
          </h2>
        </Link>
        <h1 className=" duration-300 transform transition-all hover:scale-105 ">
          Welcome back! Sign in to your account
        </h1>

        <div className="w-[340px] max-h-screen m-auto py-4 flex flex-col gap-4 items-center rounded-2xl shadow-lg opacity-90  bg-white p-8">
          <h1 className="font-serif text-center text-3xl font-bold py-6">
            Sign In
          </h1>
          <form onSubmit={handleEmailSubmit} className="flex flex-col items-center justify-between w-full">
            <input
              required
              className=" rounded-2xl bg-gray-100 p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              className=" rounded-2xl bg-gray-100 p-2 mt-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="py-3 px-7 cursor-pointer my-5 rounded-full bg-blue-600 text-white hover:bg-blue-500 duration-300"
              disabled={loading}
            >
              Sign In
                      </button>
                      {error && (
  <p className="text-red-500 text-sm text-center ">{error}</p>
)}
          </form>

          <div className=" text-center">
            <h2
              onClick={() => navigate("/")}
              className="text-sm my-2 cursor-pointer font-serif hover:underline "
            >
              Don't have an account?{" "}
              <span className="duration-300 transform transition-all hover:scale-105 inline-block  ">
                Create one
              </span>
            </h2>
          </div>

          <div className="flex items-center w-full  text-gray-400">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-xs shadow-2xl">OR CONTINUE WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-between gap-4">
            <button onClick={signInWithGoogle} className=" cursor-pointer" disabled={loading}>
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

export default SignIn;
