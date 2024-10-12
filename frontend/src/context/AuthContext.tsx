import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { getCookie } from "../utils/cookies";

type AuthUserType = {
  user: {
    id: string;
    fullName: string;
    email: string;
    gender: string;
    profilePic: string;
  };
  accessToken: string;
  refreshToken: string;
};

const AuthContext = createContext<{
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}>({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
  setIsLoading: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
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
  const [authUser, setAuthUser] = useState<AuthUserType | null>(
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
