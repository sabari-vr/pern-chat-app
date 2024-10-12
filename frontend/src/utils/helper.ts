import { getCookie } from "./cookies";
import toast from "react-hot-toast";

export const getLocalUserData = () => {
  const localUserData = getCookie("_user_data");

  if (localUserData) {
    return JSON.parse(localUserData);
  }

  return null;
};

export const successMessage = async (text: string) => {
  if (text === null || text === undefined || text === "")
    text = "Data saved successfully!";
  return toast.success(text);
};

export const errorMessage = async (text: string) => {
  if (text === null || text === undefined || text === "") text = "Error";
  toast.error(text);
};

export const clearHistoryAndRedirect = (redirectTo: string) => {
  window.history.pushState(null, "", redirectTo);
  window.location.replace(redirectTo);
};
