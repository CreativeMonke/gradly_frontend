import {
    Box,
    Button,
    TextField,
    Typography,
    Breadcrumbs,
    Grid,
    Switch,
    FormControlLabel
  } from '@mui/material'
  import { useNavigate, useParams } from 'react-router-dom'
  import { useState } from 'react'
import { useChaptersStore } from '../../../store/chaptersStore'
  
  export default function CreateChapterPage() {
    const navigate = useNavigate()
    const { subjectId } = useParams<{ subjectId: string }>()
    const { createNewChapter } = useChaptersStore()
  
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isCompleted, setIsCompleted] = useState(false)
    const [loading, setLoading] = useState(false)
  
    const handleCreate = async () => {
      if (!title || !subjectId) return alert('Title and subject ID are required.')
        console.log("Subject ID",subjectId);
      const payload = {
        title,
        description,
        subjectId: subjectId,
        isCompleted
      }
  
      setLoading(true)
      try {
        const res = await createNewChapter(payload);
        navigate(`/subjects/${subjectId}/chapters/${res._id}`)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Box p={4}>
        <Breadcrumbs>
          <Button onClick={() => navigate('/subjects')}>Subjects</Button>
          <Button onClick={() => navigate(`/subjects/${subjectId}`)}>Subject</Button>
          <Typography>Create Chapter</Typography>
        </Breadcrumbs>
  
        <Typography variant='h4' my={2}>Create Chapter</Typography>
  
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
  
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
  
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                />
              }
              label='Mark as completed'
            />
          </Grid>
  
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Button variant='outlined' onClick={() => navigate(-1)}>Back</Button>
            <Button variant='contained' onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating...' : 'Create Chapter'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }
  