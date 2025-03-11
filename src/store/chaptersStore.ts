import { create } from "zustand";
import {
  createChapter,
  getChapters,
  updateChapter,
  deleteChapter,
} from "../services/chaptersService";

export interface Chapter {
  _id: string;
  title: string;
  subjectId: string;
  description?: string;
  materials?: {
    filename: string;
    fileType: string;
    fileUrl: string;
    filePublicUrl: string;
    uploadedAt: Date;
  }[];
  markdownContent?: string;
  aiSummary?: string;
  aiNotes?: Record<string, unknown>;
  userNotes?: Record<string, unknown>;
  currentProgress: number;
  isCompleted: boolean;
  completionDate?: Date;
}

interface ChapterState {
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  sortBy: string;
  filterBy: string;
  searchBy: string;
  setSort: (sortBy: string) => void;
  setFilter: (filterBy: string) => void;
  setSearch: (search: string) => void;
  fetchChapters: (filters?: Record<string, unknown>) => Promise<void>;
  createNewChapter: (chapterData: FormData) => Promise<void>;
  updateExistingChapter: (
    chapterId: string,
    chapterData: FormData
  ) => Promise<void>;
  deleteExistingChapter: (chapterId: string) => Promise<void>;
}

export const useChaptersStore = create<ChapterState>((set) => ({
  chapters: [],
  loading: false,
  error: null,
  sortBy: "title",
  filterBy: "all",
  searchBy: "",

  // ✅ Fetch Chapters
  fetchChapters: async (filters) => {
    set({ loading: true, error: null });
    try {
      const data = await getChapters(filters);
      set({ chapters: data, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  // ✅ Create Chapter
  createNewChapter: async (chapterData) => {
    set({ loading: true, error: null });
    try {
      await createChapter(chapterData);
      const data = await getChapters(); // Refresh after creation
      set({ chapters: data, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  // ✅ Update Chapter
  updateExistingChapter: async (chapterId, chapterData) => {
    set({ loading: true, error: null });
    try {
      await updateChapter(chapterId, chapterData);
      const data = await getChapters(); // Refresh after update
      set({ chapters: data, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  // ✅ Delete Chapter
  deleteExistingChapter: async (chapterId) => {
    set({ loading: true, error: null });
    try {
      await deleteChapter(chapterId);
      const data = await getChapters(); // Refresh after deletion
      set({ chapters: data, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  setSort: (sortBy : string) => set({ sortBy }),
  setFilter: (filterBy : string) => set({ filterBy }),
  setSearch: (searchBy : string) => set({ searchBy }),
}));
