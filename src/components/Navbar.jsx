import React, { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { Link } from "react-router-dom";
import { UserContext } from "../context/AuthContext";

const Navbar = () => {

  const { user, logOut } = UserContext();
  const [showAlert, setShowAlert] = useState(false);


  return (
    <div className="bg-white   p-4 lg:px-8 sm:px-8 shadow-xl flex justify-between">
      <div className="flex items-center gap-2">
        <FaWallet size={24} className="text-blue-400" />
        <div className="flex flex-col ">
          <h1 className="font-mono font-semibold">ExpenseTracker</h1>
          <span className="text-sm text-gray-400">
            Welcome Back,{" "}
            {user?.displayName
              ? user.displayName
              : user?.email
              ? user.email.split("@")[0]
              : "User"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-gray-300/50 w-10 h-10 flex items-center justify-center rounded-full font-semibold text-gray-700">
          {user?.displayName
            ? user.displayName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()
            : user?.email
            ? user.email[0].toUpperCase()
            : ""}
        </div>
        <HiOutlineLogout
          size={24}
            className="text-gray-600 hover:text-red-500 cursor-pointer"
            onClick={() => setShowAlert(true)}
        />
      </div>
          {showAlert && (
        <div
          data-aos="fade-in"
          className="fixed transition-opacity duration-300 inset-0 flex items-center justify-center z-50  bg-opacity-20"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Sign Out</h2>
            <p className="mb-6">
              Are you sure you want to Sign Out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  setShowAlert(false);

                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                onClick={() => {
                  logOut();
                  setShowAlert(false);
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Navbar;
