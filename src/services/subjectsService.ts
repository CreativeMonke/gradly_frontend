import axios, { AxiosError } from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = useAuthStore.getState().token;

  return {
    Authorization: token ? `Bearer ${token}` : undefined,
  };
};

export const getSubjects = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subjects?createdBy=${userId}`, {
      headers: getHeaders(),
    });

    const { message, status, data } = response.data;

    if (status === 'success') {
      showSuccessToast(message);
      return data;
    } else {
      showErrorToast(message);
      return [];
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || 'Failed to fetch subjects.';
    showErrorToast(errorMessage);
    console.error('Error fetching subjects:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const createSubject = async (subjectData: {
  name: string;
  description?: string;
  subjectCategory: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subjects`, subjectData, {
      headers: getHeaders(),
    });

    const { message, status, data } = response.data;

    if (status === 'success') {
      showSuccessToast(message);
      return data;
    } else {
      showErrorToast(message);
      return null;
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || 'Failed to create subject.';
    showErrorToast(errorMessage);
    console.error('Error creating subject:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteSubject = async (subjectId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/subjects/${subjectId}`, {
      headers: getHeaders(),
    });

    const { message, status } = response.data;

    if (status === 'success') {
      showSuccessToast(message);
      return true;
    } else {
      showErrorToast(message);
      return false;
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || 'Failed to delete subject.';
    showErrorToast(errorMessage);
    console.error('Error deleting subject:', errorMessage);
    throw new Error(errorMessage);
  }
};
