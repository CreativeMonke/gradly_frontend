import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Tooltip,
    Divider,
    CircularProgress,
    Typography,
  } from '@mui/material'
  import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
  import { useState } from 'react'
  
  export type MarkdownAIAction = 'structure' | 'edit'
  
  interface MarkdownAIActionMenuProps {
    onRun: (action: MarkdownAIAction, prompt: string) => void
    loading?: boolean
    disabled?: boolean
  }
  
  export const MarkdownAIActionMenu: React.FC<MarkdownAIActionMenuProps> = ({
    onRun,
    loading = false,
    disabled = false,
  }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [prompt, setPrompt] = useState('Create a structure for this chapter')
    const open = Boolean(anchorEl)
  
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
  
    const handleClose = () => {
      setAnchorEl(null)
    }
  
    const handleRun = (action: MarkdownAIAction) => {
      if (prompt.trim().length === 0) return
      handleClose()
      onRun(action, prompt.trim())
    }
  
    return (
      <Box component='span' mr={2}>
        <Tooltip title='AI Actions'>
          <IconButton onClick={handleOpen} disabled={loading || disabled}>
            {loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
          </IconButton>
        </Tooltip>
  
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          disableAutoFocusItem
          MenuListProps={{ dense: true }}
        >
          <Box px={2} py={1} width={300}>
            <Typography variant='subtitle2' mb={1}>AI Prompt</Typography>
            <TextField
              fullWidth
              size='small'
              placeholder='Describe what you want...'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </Box>
  
          <Divider />
  
          <MenuItem onClick={() => handleRun('structure')} disabled={loading}>
            ✨ Generate Structure (Append)
          </MenuItem>
          <MenuItem onClick={() => handleRun('edit')} disabled={loading}>
            ✏️ Edit Selected Content
          </MenuItem>
        </Menu>
      </Box>
    )
  }
  