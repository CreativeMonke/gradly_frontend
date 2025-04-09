import axios from "axios";
import { Chapter, useChaptersStore } from "../store/chaptersStore";
import { showErrorToast } from "../utils/toast";
import { getHeaders } from "./chaptersService";
import { useMaterialsStore } from "../store/materialsStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadChapterMaterial = async (
  chapter: Chapter,
  newFile: File
) => {
  try {
    const formData = new FormData();
    formData.append("files", newFile);
    console.log("Chapter data", chapter);
    const updated = await useChaptersStore
      .getState()
      .updateExistingChapter(chapter._id, formData);
    return updated;
  } catch (error) {
    showErrorToast("Upload failed");
    throw error;
  }
};

export const deleteFilesGeneral = async (
  fileUrls: string[],
  type: string,
  filters: Record<string, unknown>,
  inUse: boolean
) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/files`, {
      headers: getHeaders(),
      data: {
        fileUrls,
        type,
        filters,
        inUse,
      },
    });
    const { status } = res.data;
    if (status === "success") {
      useMaterialsStore.getState().deleteFiles(fileUrls);
      return true;
    } else {
      showErrorToast("Delete failed" + res.data.message);
      return false;
    }
  } catch (error) {
    showErrorToast("Delete failed ${error}");
    throw error;
  }
};
