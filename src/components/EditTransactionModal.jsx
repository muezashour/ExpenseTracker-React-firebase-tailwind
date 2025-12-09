import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useClickOutside } from "../hooks/useClickOutside";
import { FiX } from "react-icons/fi";

const EditTransactionModal = ({
  show,
  onClose,
  onSubmit,
  transaction,
  currency,
  editError,
}) => {
  const refType = useRef(null);
  const refCategory = useRef(null);
  const refEdit = useRef(null);

  const [selected, setSelected] = useState("Select type...");
  const [selectedCategory, setSelectedCategory] =
    useState("Select category...");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategoryOpen(false);
  };

  // Load values when modal opens
  useEffect(() => {
    if (transaction) {
      setSelected(
        transaction.transactionType === "income" ? "Income" : "Expense"
      );
      setSelectedCategory(
        transaction.transactionCategory.charAt(0).toUpperCase() +
          transaction.transactionCategory.slice(1)
      );
      setAmount(transaction.transactionAmount);
      setDescription(transaction.transactionDescription);
      setDate(new Date(transaction.transactionDate));
    }
  }, [transaction]);

  useClickOutside(refType, () => setOpen(false));
  useClickOutside(refCategory, () => setCategoryOpen(false));
  useClickOutside(refEdit, () => {
    onClose();
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout;

    if (show) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [show]);

  if (!show && !isVisible) return null;

  const handleSubmit = () => {
    onSubmit({
      selected,
      selectedCategory,
      amount,
      description,
      date,
      currency,
    });
  };

  return (
    <div
      data-aos="fade-in"
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/20"
    >
      <div
        ref={refEdit}
        className={`flex flex-col bg-white rounded-2xl h-[500px] overflow-x-auto sm:w-[350px] p-4 lg:w-[450px] md:w-[400px]
  transform transition-all duration-200
  ${show ? "scale-105 opacity-100" : "scale-95 opacity-0"}
`}
      >
        <div className="flex flex-col ">
          <div className="flex gap-2 items-center justify-between">
            {/* <span className=" rounded-full ">+</span> */}
            <h1>Edit Transaction</h1>

            <div>
              <FiX
                size={20}
                className="cursor-pointer text-gray-500 hover:text-black"
                onClick={onClose}
              />
            </div>
          </div>

          {editError && (
            <p className="text-red-500 text-sm mt-2">{editError}</p>
          )}
          <form
            className="flex flex-col p-2 my-2 "
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="relative my-4">
              <label
                htmlFor="transactionType"
                className="text-gray-800 font-semibold mb-2 block"
              >
                Transaction Type
              </label>

              <div ref={refType}>
                <div
                  onClick={() => setOpen(!open)}
                  className="bg-gray-100 text-gray-800 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus:outline-none border border-gray-200"
                >
                  <span>{selected}</span>
                  <span className="text-gray-400">▼</span>
                </div>

                <div
                  className={`absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 transform origin-top ${
                    open
                      ? "scale-100 opacity-100"
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
            <div className="relative my-4">
              <label
                htmlFor="category"
                className="text-gray-800 font-semibold mb-2 block"
              >
                Category
              </label>

              <div ref={refCategory}>
                <div
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="bg-gray-100 text-gray-800 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center focus:outline-none border border-gray-200"
                >
                  <span>{selectedCategory}</span>
                  <span className="text-gray-400">▼</span>
                </div>

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
                Edit Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
