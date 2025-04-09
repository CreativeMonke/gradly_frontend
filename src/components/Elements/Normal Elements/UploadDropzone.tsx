import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadChapterMaterial } from "../../../services/materialsService";
//import { useMaterialsStore } from "../../../store/materialsStore";
import { Chapter } from "../../../store/chaptersStore";

// Services (to be implemented separately)

interface UploadDropzoneProps {
  onFilesSelected?: (files: File[]) => void;
  acceptedTypes?: string[];
  chapter?: Chapter;
  chapterId?: string;
  //subjectId?: string;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFilesSelected,
  acceptedTypes = ["application/pdf", "image/*", "text/plain"],
  chapter,
  //subjectId
}) => {
  //console.log("Upload Dropzone chapter",chapter);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // console.log(uploadedFiles);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
      if (onFilesSelected) onFilesSelected(acceptedFiles);

      if (chapter) {
         acceptedFiles.map(async (file) => {
          return await uploadChapterMaterial(chapter, file);
        });

       /* const uploaded = await Promise.all(uploadPromises);
        useMaterialsStore.getState().addFiles(uploaded.flat());*/
      }

      // TODO: Support subjectId in the future
    },
    [onFilesSelected, chapter]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple: true,
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: "2px dashed #ccc",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop files here, or click to select"}
        </Typography>
      </Paper>

      {uploadedFiles.length > 0 && (
        <List dense sx={{ mt: 2 }}>
          {uploadedFiles.map((file: File, idx: number) => (
            <ListItem key={idx}>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
