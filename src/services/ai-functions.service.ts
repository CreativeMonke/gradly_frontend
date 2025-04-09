import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../store/authStore'
import { showErrorToast } from '../utils/toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const getHeaders = () => {
  const token = useAuthStore.getState().token
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  }
}

interface AIChapterRequest {
  title: string
  description: string
}

interface AIChapterResponse {
  markdown?: string
}

export const generateChapterContentAI = async (
  payload: AIChapterRequest
): Promise<AIChapterResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/generate-chapter`, payload, {
      headers: getHeaders(),
    })

    const { status, data } = response.data
    if (status === 'success') {
      return data
    } else {
      showErrorToast('AI generation failed.')
      return {}
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    const message = axiosError.response?.data?.message ?? 'AI generation failed.'
    showErrorToast(message)
    throw new Error(message)
  }
}
