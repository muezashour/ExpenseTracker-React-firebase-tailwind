import React from "react";
import { useState } from "react";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import useAddTransaction from "../hooks/useAddTransaction";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Transactions = () => {
    const [showTransaction, setShowTransactions]=useState(false)
  const [selected, setSelected] = useState("Select type...");
  const [selectedCategory, setSelectedCategory] =
    useState("Select category...");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  // db handling
  const { addTransaction } = useAddTransaction();
  const { transactions } = useGetTransactions();

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      selected === "Select type..." &&
      selectedCategory === "Select category..."
    ) {
      setError("Please select both transaction type and category.");
      return;
    }

    if (selected === "Select type...") {
      setError("Please select a transaction type.");
      return;
    }

    if (selectedCategory === "Select category...") {
      setError("Please select a category.");
      return;
    }

    setError("");

    const newTransaction = {
      transactionDescription: description,
      transactionAmount: Number(amount),
      transactionType: selected.toLowerCase(),
      transactionCategory: selectedCategory.toLowerCase(),
      transactionDate: date.toISOString().split("T")[0],
    };

    toast.success("Transaction added successfully!");

    addTransaction(newTransaction);
    setSelected("Select type...");
    setSelectedCategory("Select category...");
    setAmount("");
    setDescription("");
    setDate(new Date());
    setError("");
    setCategoryOpen(false);
    setOpen(false);
  };

  // toggle items
  const [open, setOpen] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
  };
  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    setCategoryOpen(false);
  };
  //   *

  // Modal alert state
  const [showAlert, setShowAlert] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Delete handler for modal
  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setShowAlert(false);
    try {
      await deleteDoc(doc(db, "transactions", transactionToDelete));
      toast.success("Transaction deleted!", {
        icon: <FaTrashAlt color="red" className="animate-bounce" />,
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
        },
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
    setTransactionToDelete(null);
  };


  return (
    <div className="flex gap-3 justify-between flex-col md:flex-row lg:flex-row w-full p-6">
      {/* add transactions */}
      <div className="flex flex-col bg-white rounded-2xl min-h-screen sm:w-full p-4 lg:w-[550px] md:w-[500px]">
        <div className="flex flex-col ">
          <div className="flex gap-2 items-center">
            <span className=" rounded-full ">+</span>
            <h1>Add Transaction</h1>
          </div>
          <div>
            <h3 className="text-gray-400">Record a new income or expense</h3>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <form className="flex flex-col p-2 my-2 " onSubmit={onSubmit}>
            <div className="relative my-4">
              <label
                htmlFor="transactionType"
                className="text-gray-800 font-semibold mb-2 block"
              >
                Transaction Type
              </label>

              {/* Main button */}
              <div
                onClick={() => setOpen(!open)}
                className="bg-gray-100 text-gray-800 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus:outline-none border border-gray-200"
              >
                <span>{selected}</span>
                <span className="text-gray-400">▼</span>
              </div>

              {/* Dropdown menu */}
              {open && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div
                    onClick={() => handleSelect("Income")}
                    id="Income"
                    value="Income"
                    className="px-4 py-3 hover:bg-green-50 text-gray-700 cursor-pointer transition-colors"
                  >
                    Income
                  </div>
                  <div
                    onClick={() => handleSelect("Expense")}
                    id="Expense"
                    value="Expense"
                    className="px-4 py-3 hover:bg-red-50 text-gray-700 cursor-pointer transition-colors"
                  >
                    Expense
                  </div>
                </div>
              )}
            </div>

            {/* amount */}
            <div className="relative my-2">
              <label
                htmlFor="transactionType"
                className="text-gray-800 font-semibold mb-2 block"
              >
                amount ($)
              </label>
              <input
                required
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-100 w-full text-gray-700 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus:outline-none border border-gray-200"
              />
            </div>
            {/* description */}

            <div className="relative my-2">
              <label
                htmlFor="transactionType"
                className="text-gray-800 font-semibold mb-2 block"
              >
                Description
              </label>

              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Transaction Description"
                className="bg-gray-100 w-full text-gray-700 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus:outline-none border border-gray-200 max-h-lg "
              />
            </div>

            {/* Category */}
            <div className="relative my-4">
              <label
                htmlFor="category"
                className="text-gray-800 font-semibold mb-2 block"
              >
                Category
              </label>

              {/* Category main button */}
              <div
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="bg-gray-100 text-gray-800 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus:outline-none border border-gray-200"
              >
                <span>{selectedCategory}</span>
                <span className="text-gray-400">▼</span>
              </div>

              {/* Dropdown menu */}
              {categoryOpen && (
                <div className="absolute z-10 -mt-110 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {[
                    "Food",
                    "Rent",
                    "Transport",
                    "Shopping",
                    "Bills",
                    "Salary",
                    "Health",
                    "others",
                  ].map((cat) => (
                    <div
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      value="Category"
                      className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer transition-colors"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="relative my-2 ">
              <label
                htmlFor="transactionDate"
                className="text-gray-800 font-semibold mb-2 block"
              >
                Date
              </label>

              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="bg-gray-100 w-full text-gray-800 rounded-xl px-4 py-3 focus:outline-none border  border-gray-200"
                dateFormat="yyyy-MM-dd"
                wrapperClassName="w-full"
              />
            </div>

            {/* button */}

            <div className="my-2">
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-2xl cursor-pointer hover:bg-black/60"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
          </div>

          <button onClick={()=> setShowTransactions(!showTransaction)} className="bg-black text-white py-2 px-4 rounded-full cursor-pointer block md:hidden w-fit">
              {showTransaction ?  "Hide Transactions " : "show Transactions"}
      </button>

          {/* Recents */}

          <div
            className={`${showTransaction ? 'block' : 'hidden'} md:block flex flex-col bg-white rounded-2xl h-screen sm:w-full lg:w[600px] duration-300 `}
            data-aos="fade-left"
          >
        <div className="flex flex-col p-4 flex-shrink-0">
          <div className="flex gap-2 items-center">
            <h1>Recent Transactions</h1>
          </div>
          <div>
            <h3 className="text-gray-400">Your latest financial activities</h3>
          </div>
        </div>
        <ul className="flex flex-col mt-2 overflow-y-auto max-h-[80vh] scroll-smooth px-2 ">
          {[...transactions].reverse().map((transaction) => {
            const {
              id,
              transactionDescription,
              transactionAmount,
              transactionCategory,
              transactionDate,
              transactionType,
            } = transaction;
            return (
              <li
                // data-aos="fade-left"
                key={id}
                className="flex justify-between px-6 py-4 lg:px-10 border-b-1 border-gray-200 w-full transition-all  duration-300 ease-in-out animate-fadeUp"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      transactionType === "income"
                        ? "bg-green-200"
                        : "bg-red-200"
                    }`}
                  >
                    {transactionType === "expense" ? (
                      <BsGraphDownArrow color="red" size={24} />
                    ) : (
                      <BsGraphUpArrow color="green" size={24} />
                    )}
                  </div>
                  <div className="flex flex-col ">
                    <div className="flex gap-2">
                      <h2 className="font-semibold">
                        {transactionDescription}
                      </h2>
                      <span className="text-xs bg-gray-200 py-1 px-2 rounded-2xl">
                        {transactionCategory}
                      </span>
                    </div>
                    <h3 className="text-gray-400 mt-1">{transactionDate}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <h3
                    className={`text-lg ${
                      transactionType === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transactionType === "income"
                      ? `+$${transactionAmount}`
                      : `-$${transactionAmount}`}
                  </h3>
                  <FaRegTrashAlt
                    color="red"
                    className="cursor-pointer  "
                    size={20}
                    onClick={() => {
                      setTransactionToDelete(id);
                      setShowAlert(true);
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Custom Alert Modal */}
      {showAlert && (
        <div
          data-aos="fade-in"
          className="fixed transition-opacity duration-300 inset-0 flex items-center justify-center z-50  bg-opacity20"
        >
          <div className="bg-white/90 p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Delete Transaction</h2>
            <p className="mb-6">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  setShowAlert(false);
                  setTransactionToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
