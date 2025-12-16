
import { UserContext } from "../context/AuthContext";

export const useGetUserInfo = () => {
 const { user } = UserContext();

  if (!user) {
    return {
      name: null,
      profilePhoto: null,
      userID: null,
      isAuth: false,
    };
  }

  return {
    name: user.displayName || "User",
    profilePhoto: user.photoURL || "",
    userID: user.uid,
    isAuth: true,
  };
};
