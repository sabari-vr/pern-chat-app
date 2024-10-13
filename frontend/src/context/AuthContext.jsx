import { createContext, useContext, useState } from "react";
import { getCookie } from "../utils/cookies";

const AuthContext = createContext({
  authUser: null,
  setAuthUser: () => { },
  isLoading: true,
  setIsLoading: () => { },
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const cookieData = getCookie("_user_data");
  const localData = cookieData ? JSON.parse(cookieData) : null;

  const inital = {
    user: {
      id: "",
      fullName: "",
      email: "",
      gender: "",
      profilePic: "",
    },
    accessToken: "",
    refreshToken: "",
  };
  const [authUser, setAuthUser] = useState(
    localData || inital
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoading,
        setAuthUser,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
