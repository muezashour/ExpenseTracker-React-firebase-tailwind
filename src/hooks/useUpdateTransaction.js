import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export function useUpdateTransaction(userID) {
  const updateTransaction = async (transactionID, updatedData) => {
    try {
      const docRef = doc(
        db,
        `users/${userID}/transactions/${transactionID}`
      );

      await updateDoc(docRef, updatedData);

      return { success: true };
    } catch (error) {
      console.error("Error updating transaction:", error);
      return { success: false, error };
    }
  };

  return { updateTransaction };
}
