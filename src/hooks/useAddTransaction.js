import React from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useGetUserInfo } from "./useGetUserInfo";
import { serverTimestamp } from "firebase/firestore";

const useAddTransaction = () => {
    const { userID } = useGetUserInfo()
    const transactionCollectionRef = collection(db, `users/${userID}/transactions`);

    const addTransaction = async ({
    transactionDescription,
    transactionAmount,
    transactionType,
    transactionCategory,
    transactionDate,
    currency,

}) => {
    await addDoc(transactionCollectionRef, {
    transactionDescription,
    transactionAmount,
    transactionType,
    transactionCategory,
    transactionDate,
    currency,
    createdAt: serverTimestamp()
    });
};

return { addTransaction };
};

export default useAddTransaction;
