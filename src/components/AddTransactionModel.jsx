import DatePicker from "react-datepicker";
const AddTransactionForm = ({

  error,
  onSubmit,
  selected,
  setOpen,
  open,
  handleSelect,
  amount,
  setAmount,
  description,
  setDescription,
  selectedCategory,
  setCategoryOpen,
  categoryOpen,
  handleCategorySelect,
  date,
  setDate,
  refType,
  refCategory,
}) => {

return (
  <div

    className="flex flex-col bg-white rounded-2xl sm:w-full p-4 lg:w-[550px] md:w-[500px]"
  >
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        <span className="rounded-full">+</span>
        <h1>Add Transaction</h1>
      </div>

      <div>
        <h3 className="text-gray-400">Record a new income or expense</h3>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <form className="flex flex-col p-2 my-2" onSubmit={onSubmit}>
        {/* Transaction Type */}
        <div className="relative my-4" ref={refType}>
          <label className="text-gray-800 font-semibold mb-2 block">
            Transaction Type
          </label>

          <div
            onClick={() => setOpen(!open)}
            className="bg-gray-100 text-gray-800 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center border border-gray-200"
          >
            <span>{selected}</span>
            <span className="text-gray-400">▼</span>
          </div>

                    <div
                        ref={refType}
            className={`absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 transform origin-top ${
              open
                ? "scale-100 opacity-100 pointer-events-auto"
                : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <div
              onClick={() => handleSelect("Income")}
              className="px-4 py-3 hover:bg-green-50 text-gray-700 cursor-pointer transition-colors"
            >
              Income
            </div>
            <div
              onClick={() => handleSelect("Expense")}
              className="px-4 py-3 hover:bg-red-50 text-gray-700 cursor-pointer transition-colors"
            >
              Expense
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="relative my-2">
          <label className="text-gray-800 font-semibold mb-2 block">
            Amount ($)
          </label>
          <input
            required
            type="text"
            placeholder="0"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value.replace(/\D+/g, "").trim())
            }
            className="bg-gray-100 w-full text-gray-700 rounded-xl px-4 py-3 border border-gray-200"
          />
        </div>

        {/* Description */}
        <div className="relative my-2">
          <label className="text-gray-800 font-semibold mb-2 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Transaction Description"
            className="bg-gray-100 w-full text-gray-700 rounded-xl px-4 py-3 border border-gray-200"
          />
        </div>

        {/* Category */}
                <div ref={refCategory}
                    className="relative my-4" >
          <label className="text-gray-800 font-semibold mb-2 block">
            Category
          </label>

                    <div

            onClick={() => setCategoryOpen(!categoryOpen)}
            className="bg-gray-100 text-gray-800 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center border border-gray-200"
          >
            <span>{selectedCategory}</span>
            <span className="text-gray-400">▼</span>
          </div>

          <div
            className={`absolute z-10 h-58 overflow-y-auto w-full bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 transform bottom-13 ${
              categoryOpen
                ? "scale-100 opacity-100 pointer-events-auto"
                : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            {(selected === "Income"
              ? [
                  "Salary",
                  "Freelance",
                  "Business",
                  "Investments",
                  "Gifts",
                  "Refunds",
                  "Bonus",
                  "Others",
                ]
              : [
                  "Food",
                  "Rent",
                  "Transport",
                  "Sports",
                  "Snacks",
                  "Tobacco",
                  "Entertainment",
                  "Groceries",
                  "Education",
                  "Shopping",
                  "Bills",
                  "Health",
                  "Gifts",
                  "Missing",
                  "Others",
                ]
            ).map((cat) => (
              <div
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer transition-colors"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="relative my-2">
          <label className="text-gray-800 font-semibold mb-2 block">
            Date
          </label>
          <DatePicker
            selected={date}
            onChange={setDate}
            dateFormat="yyyy-MM-dd"
            wrapperClassName="w-full"
            className="bg-gray-100 w-full text-gray-800 rounded-xl px-4 py-3 border border-gray-200"
          />
        </div>

        <div className="my-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600/60 cursor-pointer transition-colors duration-150 font-semibold"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default AddTransactionForm;
