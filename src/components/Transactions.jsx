import React from "react";
import { useState } from "react";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import useAddTransaction from "../hooks/useAddTransaction";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { useCurrency } from "../context/CurrencyContext";
import { FaDollarSign } from "react-icons/fa";
import { FaEuroSign } from "react-icons/fa";
import { FaTurkishLiraSign } from "react-icons/fa6";
import { useClickOutside } from "../hooks/useClickOutside";
import { useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { useUpdateTransaction } from "../hooks/useUpdateTransaction";
import EditTransactionModal from "./EditTransactionModal";

const Transactions = () => {
  const { currency } = useCurrency();
  const ref = useRef(null);
  const refCategory = useRef(null);
  const refEdit = useRef(null);
  // Date range filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showTransaction, setShowTransactions] = useState(false);
  const [selected, setSelected] = useState("Select type...");
  const [selectedCategory, setSelectedCategory] =
    useState("Select category...");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  // db handling
  const { addTransaction } = useAddTransaction();
  const {
    transactions,
    setStartDate: setHookStartDate,
    setEndDate: setHookEndDate,
  } = useGetTransactions();

  // transaction edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [editError, setEditError] = useState("");
  const { userID } = useGetUserInfo();
  const { updateTransaction } = useUpdateTransaction(userID);

  const handleEdit = async (values) => {
    if (!transactionToEdit) return;

    // Check if any field was changed
    if (
      values.description === transactionToEdit.transactionDescription &&
      Number(values.amount) === Number(transactionToEdit.transactionAmount) &&
      values.selected.toLowerCase() === transactionToEdit.transactionType &&
      values.selectedCategory.toLowerCase() ===
        transactionToEdit.transactionCategory &&
      values.date.toISOString().split("T")[0] ===
        transactionToEdit.transactionDate
    ) {
      setEditError("No element edited");
      return;
    } else {
      setEditError("");
    }

    const updated = {
      transactionDescription: values.description,
      transactionAmount: Number(values.amount),
      transactionType: values.selected.toLowerCase(),
      transactionCategory: values.selectedCategory.toLowerCase(),
      transactionDate: values.date.toISOString().split("T")[0],
      currency,
    };

    const result = await updateTransaction(transactionToEdit.id, updated);

    if (result.success) {
      // Hide modal immediately
      setShowEditModal(false);
      setTransactionToEdit(null);

      // Show toast after closing modal
      toast.success("Transaction updated successfully!", {
        icon: <FaEdit color="blue" className="animate-bounce" />,
        style: {
          borderRadius: "11px",
          background: "#fff",
          color: "#333",
        },
      });
    }
  };

  // form submit handler
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
      currency,
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

  // Modal alert state
  const [showAlert, setShowAlert] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Delete handler for modal
  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setShowAlert(false);

    try {
      if (transactionToDelete === "ALL") {
        // Delete ALL transactions filtered by currency
        const filteredByCurrency = transactions.filter(
          (t) => (t.currency || "TL") === currency
        );
        for (const t of filteredByCurrency) {
          await deleteDoc(doc(db, `users/${userID}/transactions/${t.id}`));
        }

        toast.success("All transactions deleted!", {
          icon: <FaTrashAlt color="red" className="animate-bounce" />,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#333",
          },
        });
      } else {
        // Delete only ONE transaction
        await deleteDoc(
          doc(db, `users/${userID}/transactions/${transactionToDelete}`)
        );

        toast.success("Transaction deleted!", {
          icon: <FaTrashAlt color="red" className="animate-bounce" />,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#333",
          },
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }

    setTransactionToDelete(null);
  };
  React.useEffect(() => {
    if (startDate && endDate) {
      const adjustedStart = new Date(startDate);
      adjustedStart.setHours(0, 0, 0, 0);

      const adjustedEnd = new Date(endDate);
      adjustedEnd.setHours(23, 59, 59, 999);

      setHookStartDate(adjustedStart.toISOString());
      setHookEndDate(adjustedEnd.toISOString());
    } else {
      setHookStartDate(null);
      setHookEndDate(null);
    }
  }, [startDate, endDate]);

  useClickOutside(ref, () => setOpen(false));
  useClickOutside(refCategory, () => setCategoryOpen(false));
  useClickOutside(refEdit, () => setShowEditModal(false));

  return (
    <>
      <div className="flex gap-3 justify-between flex-col md:flex-row lg:flex-row w-full p-1 ">
        {/* add transactions */}
        <div
          data-aos="fade-right"
          className="flex flex-col bg-white rounded-2xl min-h-screen sm:w-full p-4 lg:w-[550px] md:w-[500px]"
        >
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
              <div className="relative my-4" ref={ref}>
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
                <div
                  className={`absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 transform origin-top ${
                    open
                      ? "scale-100 opacity-100 pointer-events-auto"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
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
                  type="text"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D+/g, "").trim();
                    setAmount(cleaned);
                  }}
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
              <div className="relative my-4" ref={refCategory}>
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
                {selected === "Income" ? (
                  <div
                    className={`absolute z-10 h-58 overflow-y-auto -mt-70 w-full bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 transform origin-top
        ${
          categoryOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        }
      `}
                  >
                    {[
                      "Salary",
                      "Freelance",
                      "Business",
                      "Investments",
                      "Gifts",
                      "Refunds",
                      "Bonus",
                      "Others",
                    ].map((cat) => (
                      <div
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer transition-colors"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`absolute z-10 h-58 overflow-y-auto -mt-70 w-full bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 transform origin-top
        ${
          categoryOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        }
      `}
                  >
                    {[
                      "Food",
                      "Rent",
                      "Transport",
                      "Sports",
                      "Snacks",
                      "Entertainment",
                      "Groceries",
                      "Education",
                      "Shopping",
                      "Bills",
                      "Health",
                      "Gifts",
                      "Missing",
                      "Others",
                    ].map((cat) => (
                      <div
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
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
        <button
          onClick={() => setShowTransactions(!showTransaction)}
          className="bg-black text-white py-2 px-4 rounded-full cursor-pointer block md:hidden w-fit"
        >
          {showTransaction ? "Hide Transactions " : "show Transactions"}
        </button>
        {/* Recents */}
        <div
          className={`${
            showTransaction ? "block" : "hidden"
          } md:block flex flex-col bg-white rounded-2xl h-[700px] sm:w-full lg:w[600px] duration-300 `}
          data-aos="fade-left"
        >
          <div className="flex flex-col p-4 flex-shrink-0 ">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-col ">
                <h1>Recent Transactions</h1>
                <h3 className="text-gray-400">
                  Your latest financial activities
                </h3>
              </div>
              <div className="flex items-center">
                <FaRegTrashAlt
                  color="red"
                  className="cursor-pointer  "
                  size={30}
                  onClick={() => {
                    setShowAlert(true);
                    setTransactionToDelete("ALL");
                  }}
                />
              </div>
            </div>

            {/* Date Filter Bar */}
            <div className="flex  flex-row gap-3 items-end justify-end mb-2 px-2">
              <div className="flex flex-col items-start sm:w-30">
                <label className="text-sm text-gray-500">From</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border px-2 py-2 border-gray-400 rounded-lg text-sm w-full"
                  placeholderText="Start date"
                />
              </div>
              <div className="flex flex-col items-start sm:w-30">
                <label className="text-sm text-gray-500">To</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border border-gray-400 px-2 py-2 rounded-lg text-sm w-full"
                  placeholderText="End date"
                />
              </div>
              <button
                className="ml-0 sm:ml-2 mt-2 sm:mt-0 px-4 py-2 text-xs rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all cursor-pointer"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                type="button"
              >
                Show All
              </button>
            </div>
          </div>
          <ul className="flex flex-col mt-2 overflow-y-auto max-h-[85vh] scroll-smooth px-2 ">
            {[...transactions]
              .filter((t) => (t.currency || "TL") === currency)
              .sort(
                (a, b) =>
                  new Date(a.transactionDate) - new Date(b.transactionDate)
              )
              .reverse()
              .map((transaction, index, arr) => {
                const {
                  id,
                  transactionDescription,
                  transactionAmount,
                  transactionCategory,
                  transactionDate,
                  transactionType,
                } = transaction;

                const currentDate = new Date(transaction.transactionDate);
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();
                const prev = arr[index - 1];
                let isNewMonth = false;

                if (!prev) {
                  isNewMonth = true;
                } else {
                  const prevDate = new Date(prev.transactionDate);
                  const prevMonth = prevDate.getMonth();
                  const prevYear = prevDate.getFullYear();

                  if (prevMonth !== currentMonth || prevYear !== currentYear) {
                    isNewMonth = true;
                  }
                }
                return (
                  <>
                    {isNewMonth && (
                      <div className="px-4 py-2 text-gray-500  text-center font-semibold bg-gray-50 rounded-lg my-2 shadow">
                        {currentDate.toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    )}
                    <li
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
                          <h3 className="text-gray-400 mt-1">
                            {transactionDate}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaEdit
                          size={20}
                          className="cursor-pointer text-gray-500 hover:text-black"
                          onClick={() => {
                            setTransactionToEdit(transaction);
                            setShowEditModal(true);
                          }}
                        />
                        <h3
                          className={`text-lg ${
                            transactionType === "expense"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          <span className="inline-flex items-center">
                            {transactionType === "income" ? "+" : "-"}
                            {currency === "USD" && (
                              <FaDollarSign
                                size={17}
                                className="inline-block "
                              />
                            )}
                            {currency === "TL" && (
                              <FaTurkishLiraSign
                                size={17}
                                className="inline-block"
                              />
                            )}
                            {currency === "EURO" && (
                              <FaEuroSign size={17} className="inline-block" />
                            )}
                            {transactionAmount}
                          </span>
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
                  </>
                );
              })}
          </ul>
        </div>

        {/* Custom Alert Modal */}
        {/* Alert Modal */}
        {showAlert && (
          <div
            data-aos="fade-right"
            className="fixed inset-0 flex items-center justify-center z-50 bg-opacity20"
          >
            <div className="bg-white/90 p-6 rounded-xl shadow-lg max-w-sm w-[300px] sm:w-96 md:w-96 lg:w-96">
              <h2 className="text-lg font-semibold mb-4">Delete Transaction</h2>

              <p className="mb-6">
                {transactionToDelete === "ALL"
                  ? "This will permanently delete all your income and expense transactions. Do you want to continue?"
                  : "Are you sure you want to delete this transaction?"}
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

      <EditTransactionModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        transaction={transactionToEdit}
        currency={currency}
        editError={editError}
        ref={refEdit}
        onSubmit={(updatedValues) => {
          handleEdit(updatedValues);
        }}
      />
    </>
  );
};

export default Transactions;
