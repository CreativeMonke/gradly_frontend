import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const { message, status, data } = response.data;

    if (status === "success") {
      useAuthStore.getState().login(data.user, data.token);
      showSuccessToast(message); // ✅ Show success toast
    } else {
      showErrorToast(message);
    }

    return response.data;
  } catch (error) {
    showErrorToast("Login failed. Please check your credentials.");
    throw error;
  }
};
