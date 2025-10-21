import React from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useGetUserInfo } from "./useGetUserInfo";
import { serverTimestamp } from "firebase/firestore";


const useAddTransaction = () => {
    const transactionCollectionRef = collection(db, "transactions");
    const { userID } = useGetUserInfo()

    const addTransaction = async ({
    transactionDescription,
    transactionAmount,
    transactionType,
    transactionCategory,
    transactionDate,

}) => {
    await addDoc(transactionCollectionRef, {
    userID,
    transactionDescription ,
    transactionAmount,
    transactionType,
    transactionCategory,
    transactionDate,
    createdAt: serverTimestamp()
    });
};

return { addTransaction };
};

export default useAddTransaction;
