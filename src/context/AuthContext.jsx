import { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithRedirect

} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const navigate = useNavigate();
  const isMobilePWA = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isStandalone && isMobile;
  };

  const googleSignIn = async () => {
  setLoading(true);
  const provider = new GoogleAuthProvider();
  try {
    if (isMobilePWA()) {

      await signInWithRedirect(auth, provider);
    } else {

      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    }
  } catch (error) {
    console.error("Google Sign-In failed:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
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
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      console.error(err);
      throw err;
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
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    setLoading(true)

     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      if (currentUser) {
        setUser(currentUser);

      } else {
        setUser(null);
      }
       setAuthResolved(true);
      setLoading(false);
     });


    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (!authResolved) return;

  setLoading(true); // keep UI waiting during redirect resolution

  const timer = setTimeout(async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        setUser(result.user);
      }
    } catch (error) {
      console.error("Redirect error:", error);
    } finally {
      setLoading(false);
    }
  }, 300); // small delay ensures resolver is ready on iOS

  return () => clearTimeout(timer);
}, [authResolved]);

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        logOut,
        user,
        loading,
        authResolved,
        signInWithEmail,
        registerWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserContext = () => useContext(AuthContext);
