import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { Axios } from "../utils/apiConfig";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation) return;
      setLoading(true);
      setMessages([]);
      Axios.get(`/messages/${selectedConversation.id}`)
        .then((res) => {
          const data = res.data;
          setMessages(data);
        })
        .catch((error) => {
          if (error.response) {
            toast.error(
              error.response.data.error ||
                error.response.data.message ||
                error.message ||
                "Login failed"
            );
          } else {
            toast.error(error.message || "Something went wrong");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getMessages();
  }, [selectedConversation, setMessages]);

  return { messages, loading };
};
export default useGetMessages;
