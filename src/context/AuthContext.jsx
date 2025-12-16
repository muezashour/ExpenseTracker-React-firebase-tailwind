import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;

    const initAuth = async () => {
      try {
        await setPersistence(auth, indexedDBLocalPersistence);
      } catch (err) {
        console.error("Failed to set persistence:", err);
      }

      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthResolved(true);
        setLoading(false);
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

 useEffect(() => {
  if (!authResolved) return;

  const publicRoutes = ["/", "/SignIn", "/SignUp"];

  if (user && publicRoutes.includes(location.pathname)) {
    navigate("/ExpenseTracker", { replace: true });
  }
}, [user, authResolved, location.pathname, navigate]);

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
     await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Email sign-in failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authResolved,
        googleSignIn,
        signInWithEmail,
        registerWithEmail,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserContext = () => useContext(AuthContext);
