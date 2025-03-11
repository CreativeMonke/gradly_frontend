import axios, { AxiosError } from "axios";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "multipart/form-data", // For file uploads
  };
};

// ✅ Create Chapter (with file upload)
export const createChapter = async (chapterData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chapters`, chapterData, {
      headers: getHeaders(),
    });

    const { status, data } = response.data;

    if (status === "success") {
      showSuccessToast("Chapter created successfully.");
      return data;
    } else {
      showErrorToast("Failed to create chapter.");
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to create chapter.";
    showErrorToast(errorMessage);
    console.error("Error creating chapter:", errorMessage);
    throw new Error(errorMessage);
  }
};

// ✅ Get Chapters (Optional Filters)
export const getChapters = async (filters?: Record<string, unknown>) => {
  try {
    console.log(filters);
    const response = await axios.get(`${API_BASE_URL}/chapters`, {
      headers: getHeaders(),
      params: filters, // ✅ Axios will handle object serialization
      paramsSerializer: (params) => {
        return new URLSearchParams(params).toString(); // ✅ Better handling of nested objects
      },
    });

    const { status, data } = response.data;

    if (status === "success") {
      return data;
    } else {
      showErrorToast("Failed to fetch chapters.");
      return [];
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch chapters.";
    showErrorToast(errorMessage);
    console.error("Error fetching chapters:", errorMessage);
    throw new Error(errorMessage);
  }
};

// ✅ Update Chapter (with file upload)
export const updateChapter = async (
  chapterId: string,
  chapterData: FormData
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/chapters/${chapterId}`,
      chapterData,
      { headers: getHeaders() }
    );

    const { status, data } = response.data;

    if (status === "success") {
      showSuccessToast("Chapter updated successfully.");
      return data;
    } else {
      showErrorToast("Failed to update chapter.");
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to update chapter.";
    showErrorToast(errorMessage);
    console.error("Error updating chapter:", errorMessage);
    throw new Error(errorMessage);
  }
};

// ✅ Delete Chapter
export const deleteChapter = async (chapterId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/chapters/${chapterId}`,
      { headers: getHeaders() }
    );

    const { status } = response.data;

    if (status === "success") {
      showSuccessToast("Chapter deleted successfully.");
      return true;
    } else {
      showErrorToast("Failed to delete chapter.");
      return false;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to delete chapter.";
    showErrorToast(errorMessage);
    console.error("Error deleting chapter:", errorMessage);
    throw new Error(errorMessage);
  }
};
