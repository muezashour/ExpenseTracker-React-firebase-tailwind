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

export const useGetTransactions = () => {
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
  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();

  const getTransactions = async () => {
    let unsubscribe;
    try {
      let queryTransactions;
      if (startDate && endDate) {
        queryTransactions = query(
          transactionCollectionRef,
          where("userID", "==", userID),
          where("transactionDate", ">=", startDate),
          where("transactionDate", "<=", endDate),
          orderBy("createdAt")
        );
      } else {
        queryTransactions = query(
          transactionCollectionRef,
          where("userID", "==", userID),
          orderBy("createdAt")
        );
      }
      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let docs = [];
        let totalIncome = 0;
        let totalExpence = 0;
        let incomeCount = 0;
        let expenseCount = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          docs.push({ ...data, id });

          if (data.transactionType === "expense") {
            totalExpence += Number(data.transactionAmount);
            expenseCount += 1;
          } else {
            totalIncome += Number(data.transactionAmount);
            incomeCount += 1;
          }
        });
        let balance = totalIncome - totalExpence;
        setTransactions(docs);
        setTransactionTotals({
          balance,
          income: totalIncome,
          expence: totalExpence,
          incomeCount,
          expenseCount,
        });
      });
    } catch (err) {
      console.error(err);
    }
    return () => unsubscribe && unsubscribe();
  };

  useEffect(() => {
    if (!userID) return;
    getTransactions();
  }, [userID, startDate, endDate]);

  return { transactions, transactionTotals, setStartDate, setEndDate };
};
