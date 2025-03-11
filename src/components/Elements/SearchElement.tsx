import { useState, ChangeEvent, FormEvent } from "react";
import {
  Paper,
  InputBase,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";

interface SearchElementProps {
  placeholder?: string;
  enableMobileDrawer?: boolean;
  onSearch: (value: string) => void;
}

export const SearchElement = ({
  placeholder = "Search...",
  enableMobileDrawer = false,
  onSearch,
}: SearchElementProps) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Handle Input Change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setValue(event.target.value);
  };

  // ✅ Handle Clear
  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  // ✅ Handle Submit (on search button click)
  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onSearch(value);
    setOpen(false);
  };

  // ✅ Handle Opening and Closing the Dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isMobile && enableMobileDrawer) {
    // ✅ Mobile View (IconButton + Dialog)
    return (
      <>
        {/* Search IconButton */}
        <IconButton onClick={handleOpen} sx={{ p: "10px" }}>
          <SearchIcon />
        </IconButton>

        {/* Search Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Search</DialogTitle>
          <DialogContent>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                borderRadius: 3,
                p: 1,
              }}
              onSubmit={handleSubmit}
            >
              <IconButton sx={{ p: "10px" }} disabled>
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                autoFocus
              />
              {value && (
                <IconButton sx={{ p: "10px" }} onClick={handleClear}>
                  <CloseIcon />
                </IconButton>
              )}
            </Paper>
          </DialogContent>

          {/* Search Button */}
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit()}
              color="primary"
              variant="contained"
            >
              Search
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // ✅ Desktop View (Standard Search Bar)
  return (
    <Paper
      component="form"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        borderRadius: 3,
      }}
      onSubmit={handleSubmit} 
    >
      {/* Search Icon */}
      <IconButton sx={{ p: "10px" }} disabled>
        <SearchIcon />
      </IconButton>

      {/* Input Field */}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />

      {/* Clear Icon */}
      {value && (
        <IconButton sx={{ p: "10px" }} onClick={handleClear}>
          <CloseIcon />
        </IconButton>
      )}
    </Paper>
  );
};
