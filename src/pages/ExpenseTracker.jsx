import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Transactions from "../components/Transactions";
import Cards from "../components/Cards";
import { Toaster } from "react-hot-toast";

const ExpenseTracker = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <>
      {isMobile ? (
        <Toaster
          position="center"
          containerStyle={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            transform: "translateY(-50%)",
          }}
        />
      ) : (
        <Toaster
          position="bottom-right"
          containerStyle={{
            zIndex: 9999,
          }}
        />
      )}
      <Navbar />
      <div className="bg-[rgba(242,242,242,0.604)] min-h-screen flex flex-col gap-4 p-1 sm:p-1 md:p-10 lg:p-10 items-center">
        {/* cards */}
        <Cards />

        {/* Transactions */}

        <Transactions />
      </div>
    </>
  );
};

export default ExpenseTracker;
