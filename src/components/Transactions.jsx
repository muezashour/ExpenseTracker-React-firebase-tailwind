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
import AddTransactionModel from "./AddTransactionModel";
import AddTransactionMobile from "./AddTransactionMobile";
import { FaPlusCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
// Helper function to detect mobile devices
const isMobile = () => window.innerWidth < 768;
const Transactions = () => {
  const { currency } = useCurrency();

  const ref = useRef(null);
  const refCategory = useRef(null);
  const refEdit = useRef(null);
  // Date range filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
  const { userID } = useGetUserInfo();
  const { updateTransaction } = useUpdateTransaction(userID);

  //Transaction eAdd  handler on small devices
  const [showAddModal, setShowAddModal] = useState(false);

  const handleEdit = async (values) => {
    if (!transactionToEdit) return;

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
      if (isMobile()) {
        toast.success("", {
          icon: <FaEdit size={100} className="text-blue-500 animate-bounce" />,
          position: "center",
          duration: 1200,
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
          },
        });
      } else {
        toast.success("Transaction updated successfully", {
          position: "bottom-right",
          icon: <FaEdit className="text-blue-500" />,
        });
      }
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
    if (isMobile()) {
      toast.success("", {
        icon: (
          <FaCheckCircle size={100} className="text-green-500 animate-bounce" />
        ),
        position: "center",
        duration: 1200,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      });
    } else {
      toast.success("Transaction added successfully", {
        position: "bottom-right",
        icon: <FaCheckCircle className="text-green-500" />,
      });
    }
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

        if (isMobile()) {
          toast.success("", {
            icon: (
              <FaTrashAlt size={100} className="text-red-500 animate-bounce" />
            ),
            position: "center",
            duration: 1200,
            style: {
              background: "transparent",
              boxShadow: "none",
              padding: 0,
            },
          });
        } else {
          toast.success("Transaction deleted successfully", {
            position: "bottom-right",
            icon: <FaTrashAlt className="text-red-500" />,
          });
        }
      } else {
        // Delete only ONE transaction
        await deleteDoc(
          doc(db, `users/${userID}/transactions/${transactionToDelete}`)
        );

        if (isMobile()) {
          toast.success("", {
            icon: (
              <FaTrashAlt size={80} className="text-red-500 animate-bounce" />
            ),
            position: "center",
            duration: 1200,
            style: {
              background: "transparent",
              boxShadow: "none",
              padding: 0,
            },
          });
        } else {
          toast.success("Transaction deleted successfully", {
            position: "bottom-right",
            icon: <FaTrashAlt className="text-red-500" />,
          });
        }
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
      <div className="flex gap-3 justify-between flex-col md:flex-row lg:flex-row w-full p-5 ">
        {/* add transactions */}
        <button
          // data-aos="fade-up"
          onClick={() => setShowAddModal(true)}
          className="md:hidden z-10 fixed bottom-7 cursor-pointer text-2xl right-7 bg-blue-500 text-white px-4 py-4 rounded-full shadow-lg shadow-blue-400/40 hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          <FaPlusCircle size={24} />
        </button>

        <div
          data-aos="fade-right"
          className="hidden md:flex lg:w-[450px] md:w-[350px]"
        >
          <AddTransactionModel
            error={error}
            onSubmit={onSubmit}
            selected={selected}
            setOpen={setOpen}
            open={open}
            handleSelect={handleSelect}
            amount={amount}
            setAmount={setAmount}
            description={description}
            setDescription={setDescription}
            selectedCategory={selectedCategory}
            setCategoryOpen={setCategoryOpen}
            categoryOpen={categoryOpen}
            handleCategorySelect={handleCategorySelect}
            date={date}
            setDate={setDate}
            refType={ref}
            refCategory={refCategory}
          />
        </div>

        {/* Recents #################### */}
        <div
          data-aos="fade-left"
          className={`
   flex flex-col bg-white rounded-2xl h-[490px] md:h-[700px] lg:h-[700px] sm:w-full lg:w[600px] duration-300  overflow-hidden p-1`}
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
          <ul className="flex flex-col mt-2 overflow-auto  max-h-[70vh] scroll-smooth px-2 ">
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
                      className="flex justify-between px-1 py-4 md:px-10 lg:px-10 border-b-1 border-gray-200 w-full transition-all  duration-300 ease-in-out animate-fadeUp"
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
                          <div className="flex gap-2 flex-col-reverse sm:flex-row sm:items-center ">
                            <h2 className="font-semibold text-sm lg:text-md md:text-md">
                              {transactionDescription}
                            </h2>
                            <span className="text-xs bg-gray-200 py-1 px-2 rounded-2xl w-fit">
                              {transactionCategory}
                            </span>
                          </div>
                          <h3 className="text-gray-400 mt-1 text-sm lg:text-md md:text-md">
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
        ref={refEdit}
        onSubmit={(updatedValues) => {
          handleEdit(updatedValues);
        }}
      />
      <AddTransactionMobile
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
      >
        <AddTransactionModel
          error={error}
          onSubmit={(e) => {
            onSubmit(e);
            setShowAddModal(false);
          }}
          selected={selected}
          setOpen={setOpen}
          open={open}
          handleSelect={handleSelect}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
          selectedCategory={selectedCategory}
          setCategoryOpen={setCategoryOpen}
          categoryOpen={categoryOpen}
          handleCategorySelect={handleCategorySelect}
          date={date}
          setDate={setDate}
          refType={ref}
          refCategory={refCategory}
        />
      </AddTransactionMobile>
    </>
  );
};

export default Transactions;
