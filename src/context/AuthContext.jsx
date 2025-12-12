import { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);

  const navigate = useNavigate();
  const googleSignIn = async () => {
  setLoading(true);
  const provider = new GoogleAuthProvider();
  try {
      const result = await signInWithPopup(auth, provider);
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
    setPersistence(auth, browserLocalPersistence).catch((err) =>
      console.error("Persistence error:", err)
    );
    setLoading(true)

     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthResolved(true);
      setLoading(false);
     });

    return () => unsubscribe();
  }, []);


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
