import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { useGetUserInfo } from "./useGetUserInfo";
import { useCurrency } from "../context/CurrencyContext";

export const useGetTransactions = () => {
  const { userID } = useGetUserInfo()
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState([]);

  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0,
    income: 0.0,
    expence: 0.0,
    incomeCount: 0,
    expenseCount: 0,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const transactionCollectionRef = collection(db,`users/${userID}/transactions`);


  const getTransactions = async () => {
    let unsubscribe;
    try {
      let queryTransactions;
      if (startDate && endDate) {
        queryTransactions = query(
          transactionCollectionRef,
          where("transactionDate", ">", startDate),
          where("transactionDate", "<=", endDate),
          orderBy("createdAt")
        );
      } else {
        queryTransactions = query(
          transactionCollectionRef,
          orderBy("createdAt")
        );
      }
      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let docs = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          docs.push({ ...data, id });
        });

        setTransactions(docs)
      },
        (err) => {
          console.error("transactions snapshot error", err);
        }
      );
    } catch (err) {
      console.error(err);
    }
    return () => unsubscribe && unsubscribe();
  };

  useEffect(() => {
    if (!userID) return;
    getTransactions();
  }, [userID, startDate, endDate]);

   useEffect(() => {

    if (!transactions || transactions.length === 0) {
      setTransactionTotals({
        balance: 0.0,
        income: 0.0,
        expence: 0.0,
        incomeCount: 0,
        expenseCount: 0,
      });
      return;
    }

    // Filter by selected currency. Use a fallback if transaction has no currency.
    const filtered = transactions.filter((t) => {
      const txCurrency = t.currency || "TL";
      return txCurrency === currency;
    });

    // Compute totals from filtered list
    let totalIncome = 0;
    let totalExpence = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    for (const t of filtered) {
      const amount = Number(t.transactionAmount) || 0;
      if (t.transactionType === "expense") {
        totalExpence += amount;
        expenseCount += 1;
      } else {
        totalIncome += amount;
        incomeCount += 1;
      }
    }

    const balance = totalIncome - totalExpence;

    setTransactionTotals({
      balance,
      income: totalIncome,
      expence: totalExpence,
      incomeCount,
      expenseCount,
    });
  }, [transactions, currency]);


  return { transactions, transactionTotals, setStartDate, setEndDate };
};
