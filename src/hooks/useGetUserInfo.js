import React from 'react'
import { UserContext } from "../context/AuthContext";

 export const useGetUserInfo = () => {
     const { user } = UserContext();

     if (!user) {
       return { name: null, proflePhoto: null, userID: null, isAuth: false };
     }

     const name = user.displayName || "User";
     const proflePhoto = user.photoURL || "";
     const userID = user.uid;
     const isAuth = true;

     return {name,proflePhoto,userID,isAuth }
}
