
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SignUp from "./pages/SignUp";
import { Routes, Route } from 'react-router-dom'
import SignIn from "./pages/SignIn";
import ExpenseTracker from "./pages/ExpenseTracker";
import { AuthContextProvider } from "./context/AuthContext";
import Protected from "./components/Protected";





function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);



  return (
    <div>

      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/SignIn' element={ <SignIn /> } />
          <Route path='/ExpenseTracker' element={<Protected><ExpenseTracker/></Protected>} />
        </Routes>
      </AuthContextProvider>

    </div>
  )
}

export default App
