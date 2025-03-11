import { create } from "zustand";
import {
  getSubjects,
  createSubject as createSubjectAPI,
  updateSubject as updateSubjectAPI,
  deleteSubject as deleteSubjectAPI,
} from "../services/subjectsService";

export interface Subject {
  _id: string;
  name: string;
  description?: string;
  subjectCategory:
    | "mate-info"
    | "stiinte"
    | "filo"
    | "tehnologic"
    | "pedagogic"
    | "university-admission";
  createdBy: string | null;
  isMarketplaceVisible: boolean;
  isTemplate: boolean;
  chapters: string[];
}

export interface SubjectsState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  fetchSubjects: (userId: string) => Promise<void>;
  createSubject: (subjectData: {
    name: string;
    description?: string;
    subjectCategory: string;
    isMarketplaceVisible: boolean;
    isTemplate: boolean;
  }) => Promise<void>;
  updateSubject: (
    subjectId: string,
    subjectData: {
      name: string;
      description?: string;
      subjectCategory: string;
      isMarketplaceVisible: boolean;
      isTemplate: boolean;
    }
  ) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
}

export const useSubjectsStore = create<SubjectsState>((set) => ({
  subjects: [],
  loading: false,
  error: null,

  // ✅ Fetch Subjects
  fetchSubjects: async (userId = "") => {
    set({ loading: true, error: null });
    try {
      const data = await getSubjects(userId);
      set({ subjects: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  // ✅ Create Subject (Optimistic Update)
  createSubject: async (subjectData ) => {
    try {
      const newSubject = await createSubjectAPI(subjectData);
      const data = await getSubjects(newSubject.createdBy);
      set({ subjects: data, loading: false });
      console.log(newSubject, "new subject");
      return newSubject;
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  // ✅ Update Subject (Optimistic Update)
  updateSubject: async (subjectId, subjectData) => {
    try {
      const updatedSubject = await updateSubjectAPI(subjectId, subjectData);
      if (updatedSubject) {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject._id === subjectId ? updatedSubject : subject
          ),
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  // ✅ Delete Subject (Optimistic Update)
  deleteSubject: async (subjectId) => {
    try {
      const success = await deleteSubjectAPI(subjectId);
      if (success) {
        set((state) => ({
          subjects: state.subjects.filter(
            (subject) => subject._id !== subjectId
          ),
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
