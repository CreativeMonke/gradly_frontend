import {
  Box,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  TextFieldProps,
} from "@mui/material";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  color?: TextFieldProps["color"];
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  label = "Markdown Editor",
  color = "info",
}) => {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  // Auto switch when content is filled externally (e.g. AI)

  const handleModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "edit" | "preview" | null
  ) => {
    if (newMode) setMode(newMode);
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h6">{label}</Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
        >
          <ToggleButton value="edit">
            <EditIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="preview">
            <VisibilityIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          minHeight: 200,
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        {mode === "edit" ? (
          <TextField
            color={color}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            multiline
            minRows={10}
            fullWidth
            placeholder="Write your markdown content here..."
            variant="outlined"
          />
        ) : (
          <Box sx={{ whiteSpace: "pre-wrap" }}>
            <ReactMarkdown>
              {value || "*Nothing to preview yet.*"}
            </ReactMarkdown>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MarkdownEditor;
