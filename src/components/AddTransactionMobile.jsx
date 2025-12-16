import { useClickOutside } from "../hooks/useClickOutside";
import { useRef,useState,useEffect } from "react";
const AddTransactionModal = ({ show, onClose, children }) => {

    const refEdit = useRef(null);

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

  return (
      <div

           data-aos="fade-right"
          className="fixed inset-0 z-50 flex items-center justify-center">
     <div
        ref={refEdit}
        className={`flex flex-col bg-white rounded-2xl h-[500px] overflow-x-auto sm:w-[350px] p-4 lg:w-[450px] md:w-[400px]
  transform transition-all duration-200 shadow-2xl
  ${show ? "scale-105 opacity-100" : "scale-95 opacity-0"}
`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-4 text-xl cursor-pointer font-bold text-gray-600 hover:text-gray-800"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
};

export default AddTransactionModal;
