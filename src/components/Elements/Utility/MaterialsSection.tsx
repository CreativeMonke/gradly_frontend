import {
  Box,
  Typography,
  List,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Paper,
  ListItemButton,
  ListItemIcon,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ViewListIcon from "@mui/icons-material/ViewList";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { useEffect, useState } from "react";
import { UploadDropzone } from "../Normal Elements/UploadDropzone";
import { useMaterialsStore } from "../../../store/materialsStore";
import { Chapter } from "../../../store/chaptersStore";
import { deleteFilesGeneral } from "../../../services/materialsService";
import {
  DeleteRounded,
  DownloadRounded,
  ExpandMoreRounded,
  MenuOpenRounded,
  OpenInNewRounded,
  Visibility,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { getFileIcon } from "../../../utils/render-file-icon";

export interface MaterialFile {
  filename: string;
  fileType: string;
  fileUrl: string;
  filePublicUrl: string;
  uploadedAt: Date;
}

interface Props {
  materials: MaterialFile[];
  chapterId: string;
  chapter: Chapter;
}



export const MaterialsSection: React.FC<Props> = ({
  chapter,
  materials,
  chapterId,
}) => {
  useEffect(() => {
    if (materials.length > 0) {
      useMaterialsStore.getState().setFiles(materials);
    }
  }, [materials]);

  const [selected, setSelected] = useState<MaterialFile | null>(
    materials[0] ?? null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFile, setMenuFile] = useState<MaterialFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  const [fileListOpen, setFileListOpen] = useState(false);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    file: MaterialFile
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuFile(file);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuFile(null);
  };

  const handlePreview = () => {
    if (menuFile) setSelected(menuFile);
    handleCloseMenu();
    setFileListOpen(false);
  };

  const handleOpenInNewTab = () => {
    if (menuFile) {
      window.open(menuFile.filePublicUrl, "_blank");
    }
    handleCloseMenu();
  };
  const handleDelete = () => {
    if (menuFile) {
      deleteFilesGeneral([menuFile.fileUrl], "chapters", { chapterId }, true);
      setSelected(materials[0] ?? null);
    }
    handleCloseMenu();
  };

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => setUploadModalOpen(false);

  const renderFileList = () => (
    <List
      dense
      sx={{
        width: "100%",
        maxHeight: "100%",
      }}
    >
      {materials.map((file, index) => (
        <ListItemButton
          key={index}
          selected={selected?.fileUrl === file.fileUrl}
          onClick={() => {
            setSelected(file);
            if (fullPreviewMode) setFileListOpen(false);
          }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>{getFileIcon(file)}</ListItemIcon>
          <ListItemText
            sx={{
              overflow: "hidden",
            }}
            primary={
              file.filename.trim().slice(0, 50) +
              (file.filename.length > 50 ? " ..." : "")
            }
            secondary={new Date(file.uploadedAt).toLocaleDateString()}
          />
          <IconButton
            edge="end"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenMenu(e, file);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      position="relative"
    >
      {/* Auto-upload Dropzone */}
      {materials.length === 0 && (
        <Box p={2}>
          <UploadDropzone
            chapter={chapter}
            chapterId={chapterId}
            onFilesSelected={(files) => console.log("Auto-upload files", files)}
          />
        </Box>
      )}
      {/* File list */}
      <AnimatePresence>
        {fileListOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: 80, // height of FAB + margin
              right: 90,
              zIndex: 1200,
            }}
          >
            <Box
              sx={{
                width: "max-content",
                maxHeight: "60vh",
                overflowY: "auto",
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Materials
              </Typography>
              {renderFileList()}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split Mode File List (not shown in fullPreviewMode) */}
      {!fullPreviewMode && materials.length > 0 && (
        <Box>{renderFileList()}</Box>
      )}

      <Divider
        sx={{
          mt: fullPreviewMode ? 0 : "auto",
        }}
      />

      {/* Preview Section */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {selected && (
          <Box
            p={2}
            sx={{
              flexGrow: fullPreviewMode ? 1 : 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="body2" gutterBottom>
              Preview: <strong>{selected.filename}</strong>
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                height: fullPreviewMode ? "calc(100vh - 140px)" : "280px",
                overflow: "hidden",
              }}
            >
              <iframe
                src={selected.filePublicUrl}
                title="File Preview"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </Paper>
          </Box>
        )}
      </motion.div>
      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={handlePreview}
          sx={{
            display: "flex",
            alignItems: "space-between",
            gap: 1,
          }}
        >
          <Visibility />
          Preview
        </MenuItem>
        <MenuItem
          onClick={handleOpenInNewTab}
          sx={{
            display: "flex",
            alignItems: "space-between",
            gap: 1,
          }}
        >
          <OpenInNewRounded />
          Open in New Tab
        </MenuItem>
        <MenuItem
          disabled
          sx={{
            display: "flex",
            alignItems: "space-between",
            gap: 1,
          }}
        >
          <DownloadRounded />
          Download
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            display: "flex",
            alignItems: "space-between",
            gap: 1,
          }}
        >
          <DeleteRounded fontSize="small" color="error" />
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Collapsible Gmail-style FAB group */}
      {materials.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Animated FAB group */}
          <AnimatePresence>
            {fabMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{
                  background: theme.palette.background.paper,
                  borderRadius: 16,
                  padding: 8,
                  marginBottom: 8,
                  boxShadow: theme.shadows[6],
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Tooltip title="Upload Materials">
                  <Fab color="primary" size="medium" onClick={openUploadModal}>
                    <UploadFileIcon />
                  </Fab>
                </Tooltip>
                {fullPreviewMode && (
                  <Tooltip title="Show Materials List">
                    <Fab
                      size="medium"
                      color="default"
                      onClick={() => setFileListOpen(!fileListOpen)}
                    >
                      <ViewListIcon />
                    </Fab>
                  </Tooltip>
                )}
                <Tooltip
                  title={fullPreviewMode ? "Exit Full Preview" : "Full Preview"}
                >
                  <Fab
                    size="medium"
                    color="secondary"
                    onClick={() => {
                      setFullPreviewMode((prev) => !prev);
                      setFileListOpen(false);
                    }}
                  >
                    {fullPreviewMode ? (
                      <CloseFullscreenIcon />
                    ) : (
                      <OpenInFullIcon />
                    )}
                  </Fab>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAB menu toggle */}
          <motion.div layout animate={{ rotate: fabMenuOpen ? 180 : 0 }}>
            <Tooltip title={fabMenuOpen ? "Hide actions" : "Show actions"}>
              <Fab
                size="medium"
                color="primary"
                onClick={() => setFabMenuOpen((prev) => !prev)}
              >
                {fabMenuOpen ? <ExpandMoreRounded /> : <MenuOpenRounded />}
              </Fab>
            </Tooltip>
          </motion.div>
        </Box>
      )}

      {/* Upload Modal */}
      <Dialog
        open={uploadModalOpen}
        onClose={closeUploadModal}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload Materials</DialogTitle>
        <DialogContent>
          <UploadDropzone
            chapterId={chapterId}
            chapter={chapter}
            onFilesSelected={(files) => {
              console.log("Modal-upload files", files);
              closeUploadModal();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
