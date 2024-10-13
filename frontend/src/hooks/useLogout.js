import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Axios } from "../utils/apiConfig";
import { removeCookie } from "../utils/cookies";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    Axios.post("/auth/logout")
      .then(() => {
        setAuthUser({
          user: {
            id: "",
            fullName: "",
            email: "",
            gender: "",
            profilePic: "",
          },
          accessToken: "",
          refreshToken: "",
        });
        removeCookie("_user_data");
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.error || "Logout failed");
        } else {
          toast.error(error.message || "Something went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, logout };
};
export default useLogout;
