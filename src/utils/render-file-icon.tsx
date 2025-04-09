import {
  InsertDriveFile as InsertDriveFileIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  Slideshow as SlideshowIcon,
  TableChart as TableChartIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { JSX } from "react";

export interface RenderableFile {
  filename: string;
  fileType: string;
}

const FileIconWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});

export const getFileIcon = (file: RenderableFile): JSX.Element => {
  const ext = file.filename.split(".").pop()?.toLowerCase() || "file";

  if (file.fileType.includes("pdf"))
    return <PictureAsPdfIcon fontSize="medium" color="error" />;
  if (file.fileType.includes("image"))
    return <ImageIcon fontSize="medium" color="primary" />;

  let icon: JSX.Element = <InsertDriveFileIcon fontSize="small" />;
  if (file.fileType.includes("presentation"))
    icon = <SlideshowIcon fontSize="medium" color="secondary" />;
  else if (file.fileType.includes("spreadsheet"))
    icon = <TableChartIcon fontSize="medium" color="success" />;
  else if (file.fileType.includes("code"))
    icon = <CodeIcon fontSize="medium" color="info" />;
  else if (file.fileType.includes("text"))
    icon = <DescriptionIcon fontSize="medium" />;

  return (
    <FileIconWrapper>
      {icon}
      <Typography variant="caption" sx={{ fontSize: 10 }}>
        {ext}
      </Typography>
    </FileIconWrapper>
  );
};
