import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    const { message, status, data } = response.data;
    if (status === "success") {
      useAuthStore.getState().login(data.user, data.token);
      showSuccessToast(message);
    } else {
      showErrorToast(message);
    }

    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      "Login failed. Please check your credentials.";
    showErrorToast(errorMessage);
    throw new Error(errorMessage);
  }
};

export const validateSession = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { message, status } = response.data;

    if (status !== "success") {
      showErrorToast(message);
      return { message, status, data: null };
    }

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Session validation failed.";
    showErrorToast(errorMessage);
    console.error(errorMessage);
    return {
      message: errorMessage,
      status: "error",
      data: null,
    };
  }
};
