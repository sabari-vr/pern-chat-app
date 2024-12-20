import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Axios } from "../utils/apiConfig";
import { setCookie } from "../utils/cookies";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async (inputs) => {
    setLoading(true);
    Axios.post("/auth/signup", inputs)
      .then((res) => {
        const data = res.data;
        setAuthUser(data);
        setCookie("_user_data", JSON.stringify(data));
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.error || "Signup failed");
        } else {
          toast.error(error.message || "Something went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, signup };
};
export default useSignup;
