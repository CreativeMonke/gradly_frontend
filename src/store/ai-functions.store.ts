import { create } from 'zustand'
import { generateChapterContentAI } from '../services/ai-functions.service'

interface AIFunctionsState {
  loading: boolean
  aiMarkdown: string
  error: string | null
  generateChapterContent: (title: string, description: string) => Promise<void>
}

export const useAIFunctionsStore = create<AIFunctionsState>((set) => ({
  loading: false,
  aiMarkdown: '',
  error: null,

  generateChapterContent: async (title, description) => {
    set({ loading: true, error: null })
    try {
      const result = await generateChapterContentAI({ title, description })
      set({ aiMarkdown: result.markdown ?? '', loading: false })
    } catch (err) {
      console.error(err)
      set({ error: 'AI generation failed', loading: false })
    }
  }
}))
