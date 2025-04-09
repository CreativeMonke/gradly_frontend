import { create } from "zustand";
import { MaterialFile } from "../components/Elements/Utility/MaterialsSection";
import { useChaptersStore } from "./chaptersStore";

interface MaterialsState {
  files: MaterialFile[];
  setFiles: (files: MaterialFile[]) => void;
  addFiles: (newFiles: MaterialFile[]) => void;
  deleteFiles: (selectedFiles: string[]) => void;
}

export const useMaterialsStore = create<MaterialsState>((set) => ({
  files: [],
  setFiles: (files) => set({ files }),

  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),
  deleteFiles: (selectedFileUrls) => {
    set((state) => ({
      files: state.files.filter(
        (file) => !selectedFileUrls.includes(file.fileUrl)
      ),
    }));

    // Also remove from chapters
    useChaptersStore.getState().removeFilesFromChapters(selectedFileUrls);

    // If you have subjects:
    // useSubjectsStore.getState().removeFilesFromSubjects(selectedFileUrls);
  },
}));
