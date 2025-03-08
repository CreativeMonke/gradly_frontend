import { create } from 'zustand';
import { getSubjects } from '../services/subjectsService';

interface Subject {
  _id: string;
  name: string;
  description?: string;
  subjectCategory: 'mate-info' | 'stiinte' | 'filo' | 'tehnologic' | 'pedagogic' | 'university-admission';
  createdBy: string | null;
  isMarketplaceVisible: boolean;
  isTemplate: boolean;
  chapters: string[];
}

interface SubjectsState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  fetchSubjects: (userId: string) => Promise<void>;
}

export const useSubjectsStore = create<SubjectsState>((set) => ({
  subjects: [],
  loading: false,
  error: null,

  fetchSubjects: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await getSubjects(userId);
      set({ subjects: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
