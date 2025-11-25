import React, { useState } from "react";
import { FaChevronUp, FaWallet } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";

import { FaEuroSign } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { UserContext } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { FaChevronDown } from "react-icons/fa";
import { FaTurkishLiraSign } from "react-icons/fa6";
import ReactCountryFlag from "react-country-flag";

const Navbar = () => {
  const { currency, setCurrency } = useCurrency();
  const { user, logOut } = UserContext();
  const [showAlert, setShowAlert] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <div className="bg-white   p-4 lg:px-8 sm:px-8 shadow-xl flex justify-between">
      <div className="flex items-center gap-2">
        <FaWallet size={24} className="text-blue-400" />
        <div className="flex flex-col ">
          <h1 className="font-mono font-semibold">ExpenseTracker</h1>
          <span className="text-sm text-gray-400">
            {user?.displayName
              ? user.displayName
              : user?.email
              ? user.email.split("@")[0]
              : "User"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ">
        <div
          onClick={() => setShowCurrency(!showCurrency)}
          className=" flex items-center gap-2 justify-between rounded-full  px-5 py-2 cursor-pointer relative"
        >
          <span>
            {currency === "USD" && (
              <ReactCountryFlag
                  countryCode="US"
                  svg
                  style={{ width: "1.3em", height: "1.3em", borderRadius: "9999px", overflow: "hidden" }}
                />
            )}
            {currency === "TL" && (
              <ReactCountryFlag
                  countryCode="TR"
                  svg
                  style={{ width: "1.3em", height: "1.3em", borderRadius: "9999px", overflow: "hidden" }}
                />
            )}
            {currency === "EURO" && (
              <ReactCountryFlag
                  countryCode="EU"
                  svg
                  style={{ width: "1.3em", height: "1.3em", borderRadius: "9999px", overflow: "hidden" }}
                />
            )}
          </span>

          <FaChevronUp
            size={14}
            color="gray"
            className={`transition-transform ${
              showCurrency ? "rotate-180" : "rotate-0"
            }`}
          />
          {showCurrency && (
            <div className="  absolute z-10 mt-2 w-30  bg-white rounded-xl shadow-lg border border-gray-600 overflow-hidden top-10 -left-1 ">

              <div
                onClick={() => setCurrency("USD")}
                id="USD"
                value="USD"
                className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50  cursor-pointer transition-colors"
              >
                <ReactCountryFlag
                  countryCode="US"
                  svg
                  style={{ width: "1.3em", height: "1.3em", borderRadius: "9999px", overflow: "hidden" }}
                />
                <span className="ml-2">USD</span>
              </div>
              <div
                onClick={() => setCurrency("TL")}
                id="TL"
                value="TL"
                className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
              >
                <ReactCountryFlag
                  countryCode="TR"
                  svg
                  style={{ width: "1.3em", height: "1.3em", borderRadius: "9999px", overflow: "hidden" }}
                />
                <span className="ml-2">TL</span>
              </div>
              <div
                onClick={() => setCurrency("EURO")}
                id="EURO"
                value="EURO"
                className="text-gray-500 font-semibold font-mono flex items-center  px-4 py-2 hover:bg-green-50  cursor-pointer transition-colors"
              >
                <ReactCountryFlag
                  countryCode="EU"
                  svg
                  style={{ width: "1.3em", height: "1.3em", borderRadius: "9999px", overflow: "hidden" }}
                />
                <span className="ml-2">EURO</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-300/50 w-10 h-10 flex items-center justify-center rounded-full font-semibold text-gray-700 relative cursor-pointer">
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
            <p className="mb-6">Are you sure you want to Sign Out?</p>
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
