import axios, { AxiosError } from "axios";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { useAuthStore } from "../store/authStore";
import { Chapter } from "../store/chaptersStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getHeaders = (isFormData = false) => {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {};

  if (token) headers["Authorization"] = `Bearer ${token}`;

  // ❌ Don't set Content-Type for FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// ✅ Create Chapter (with file upload)
export const createChapter = async (chapterData: Record<string, unknown>) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chapters`, chapterData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json", // required for JSON body
      },
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
  chapterData: FormData,
  silentFunction = false
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/chapters/${chapterId}`,
      chapterData,
      { headers: getHeaders(true) }
    );

    const { status, data } = response.data;

    if (status === "success") {
      if (!silentFunction) showSuccessToast("Chapter updated successfully.");
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

// chaptersService.ts
export const deleteChapterFile = async (
  chapterId: string,
  filePublicUrl: string
): Promise<Chapter> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/chapters/${chapterId}/files`,
      {
        headers: getHeaders(),
        data: { filePublicUrl }, // ✅ Axios uses `data` to send body with DELETE
      }
    );

    const { status, data } = response.data;

    if (status === "success") {
      showSuccessToast("File deleted successfully.");
      return data as Chapter;
    } else {
      showErrorToast("Failed to delete file.");
      throw new Error("Failed to delete file.");
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to delete file.";
    showErrorToast(errorMessage);
    console.error("Error deleting file:", errorMessage);
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
