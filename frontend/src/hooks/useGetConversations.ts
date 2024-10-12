import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Axios } from "../utils/apiConfig";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      Axios.get("/messages/conversations")
        .then((res) => {
          const data = res.data;
          setConversations(data);
        })
        .catch((error) => {
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

    getConversations();
  }, []);

  return { loading, conversations };
};
export default useGetConversations;
