import { create } from "zustand";
import {
  createChapter,
  getChapters,
  updateChapter,
  deleteChapter,
  deleteChapterFile,
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
  createNewChapter: (chapterData: Record<string, unknown>) => Promise<Chapter>;
  updateExistingChapter: (
    chapterId: string,
    chapterData: FormData,
    silentFunction?: boolean
  ) => Promise<void>;
  deleteChapterFileFromStore: (
    chapterId: string,
    filePublicUrl: string
  ) => Promise<void>;
  removeFilesFromChapters: (fileUrls: string[]) => void;
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
      const created = await createChapter(chapterData); // <- This already returns the data
      const data = await getChapters();
      set({ chapters: data, loading: false });
      return created; // ✅ return the created chapter
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  // ✅ Update Chapter
  updateExistingChapter: async (
    chapterId,
    chapterData,
    silentFunction = false
  ) => {
    set({ loading: true, error: null });
    console.log("Silent Function", silentFunction);
    try {
      const updatedChapter = await updateChapter(
        chapterId,
        chapterData,
        silentFunction
      );

      set((state) => {
        const newChapters = state.chapters.map((chapter) =>
          chapter._id === chapterId ? updatedChapter : chapter
        );
        console.log("Updated chapters:", newChapters);
        return {
          chapters: newChapters,
          loading: false,
        };
      });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  deleteChapterFileFromStore: async (
    chapterId: string,
    filePublicUrl: string
  ) => {
    set({ loading: true, error: null });
    try {
      const updatedChapter = await deleteChapterFile(chapterId, filePublicUrl);
      set((state) => ({
        chapters: state.chapters.map((chapter) =>
          chapter._id === chapterId ? updatedChapter : chapter
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
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

  setSort: (sortBy: string) => set({ sortBy }),
  setFilter: (filterBy: string) => set({ filterBy }),
  setSearch: (searchBy: string) => set({ searchBy }),
  removeFilesFromChapters: (fileUrls) =>
    set((state) => ({
      chapters: state.chapters.map((chapter) => ({
        ...chapter,
        materials: chapter.materials?.filter(
          (file) => !fileUrls.includes(file.fileUrl)
        ),
      })),
    })),
}));
