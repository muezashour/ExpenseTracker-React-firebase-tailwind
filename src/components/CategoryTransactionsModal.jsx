import { useEffect, useState } from "react";

const CategoryTransactionsModal = ({
   isOpen,
   onClose,
   title,
   transactions,
    currencyIcon,
   type,
 }) => {
  const [visible, setVisible] = useState(isOpen);
  const transactionType = type || "expense";

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div data-aos="fade-in" className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200
                    ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* modal */}
      <div
        className={`relative bg-white rounded-2xl w-[300px] sm:w-full md:w-full lg:w-full  max-w-lg p-6 z-10
                    transform transition-all duration-200 ease-out
                    ${isOpen ? "scale-105 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold capitalize text-gray-500">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer text-2xl "
          >
            ✕
          </button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No transactions found.
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar- ">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center border-gray-300 border-b pb-2 transition-all  duration-300 ease-in-out animate-fadeUp"
              >
                <div>
                  <p className="font-medium text-gray-400 text-sm">{t.transactionDescription }</p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.transactionDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`font-semibold text-md ${
                    transactionType === "expense" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {currencyIcon("inline-block mr-1", 14)}
                  {t.transactionAmount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTransactionsModal;
