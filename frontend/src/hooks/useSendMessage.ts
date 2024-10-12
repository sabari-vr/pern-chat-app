import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { Axios } from "../utils/apiConfig";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message: string) => {
    if (!selectedConversation) return;
    setLoading(true);
    Axios.post(`/messages/send/${selectedConversation.id}`, { message })
      .then((res) => {
        const data = res.data;
        setMessages([...messages, data]);
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

  return { sendMessage, loading };
};
export default useSendMessage;
