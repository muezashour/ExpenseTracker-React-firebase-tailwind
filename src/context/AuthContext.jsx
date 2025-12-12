import { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // getRedirectResult,
  // signInWithRedirect

} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  // const [processedRedirect, setProcessedRedirect] = useState(false);
  const navigate = useNavigate();
  // const isMobilePWA = () => {
  //   const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   return isStandalone && isMobile;
  // };

  const googleSignIn = async () => {
  setLoading(true);
  const provider = new GoogleAuthProvider();
  try {

      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;

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

      // Delay auth resolution to ensure Firebase restores session on PWA
      setTimeout(() => {
        setAuthResolved(true);
        setLoading(false);
      }, 2200);
     });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   if (!authResolved) return;
  //   if (processedRedirect) return;

  //   // If Firebase already restored a user, skip redirect handling.
  //   if (user) {
  //     setProcessedRedirect(true);
  //     return;
  //   }

  //   setLoading(true);

  //   const timer = setTimeout(async () => {
  //     try {
  //       const result = await getRedirectResult(auth);
  //       if (result?.user) {
  //         setUser(result.user);
  //       }
  //     } catch (error) {
  //       console.error("Redirect error:", error);
  //     } finally {
  //       setProcessedRedirect(true);
  //       setLoading(false);
  //     }
  //   }, 1500); // ensure iOS has time to restore persistence

  //   return () => clearTimeout(timer);
  // }, [authResolved, user, processedRedirect]);

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
