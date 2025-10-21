import React from "react";
import Navbar from "../components/Navbar";
import Transactions from "../components/Transactions";
import Cards from "../components/Cards";
import { Toaster } from "react-hot-toast";


const ExpenseTracker = () => {
  return (
    <>
      <Navbar />
      <div className=" min-h-screen flex flex-col gap-4  sm:p-10 items-center">
        {/* cards */}
        <Cards />

        {/* Transactions */}

        <Transactions />
        <Toaster position="buttom-right" reverseOrder={false} />
      </div>
    </>
  );
};

export default ExpenseTracker;
