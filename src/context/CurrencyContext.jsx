import { createContext, useContext, useState ,useEffect} from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(()=>{
    const savedCurrency = localStorage.getItem("curreny");
    return savedCurrency || "USD";
  });
  useEffect(() => {
      localStorage.setItem("curreny", currency);
    }, [currency]);
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
