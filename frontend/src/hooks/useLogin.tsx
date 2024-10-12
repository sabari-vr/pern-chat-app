import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Axios } from "../utils/apiConfig";
import { setCookie } from "../utils/cookies";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username: string, password: string) => {
    setLoading(true);
    Axios.post("/auth/login", { username, password })
      .then((res) => {
        const data = res.data;
        setAuthUser(data);
        setCookie("_user_data", JSON.stringify(data));
      })
      .catch((error: AxiosError | any) => {
        if (error.response) {
          toast.error(error.response.data.error || "Login failed");
        } else {
          toast.error(error.message || "Something went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, login };
};
export default useLogin;
