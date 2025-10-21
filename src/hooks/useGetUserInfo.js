import React from 'react'

 export const useGetUserInfo = () => {
     const { name, proflePhoto, userID, isAuth } = JSON.parse(localStorage.getItem("auth")) ||{}


     return {name,proflePhoto,userID,isAuth }
}


