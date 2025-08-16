// frontend/src/components/NoteList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, CircularProgress, TextField } from '@mui/material'; // <--- ADD TextField
import SearchIcon from '@mui/icons-material/Search';


function NoteList({ onSelectNote, onError }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setApiError(null);
      const token = localStorage.getItem('firebaseIdToken');
      if (!token) {
        onError("Authentication token missing. Please sign in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/my-notes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNotes(data.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setApiError(`Failed to load notes: ${error.message}`);
        onError(`Failed to load notes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [onError]);

  if (loading) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center', mt: 4 }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }} color="text.primary">Loading notes...</Typography>
      </Box>
    );
  }

  if (apiError) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">Error: {apiError}</Typography>
      </Box>
    );
  }

  if (notes.length === 0) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.primary">No notes uploaded yet. Upload your first note!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', maxWidth: '1200px', margin: '20px auto', backgroundColor: 'background.paper', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', color: 'text.primary' }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'text.primary', marginBottom: '25px' }}>
        My Notes
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {notes.map(note => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom color="text.primary">
                  {note.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 1, maxHeight: '80px', overflow: 'hidden' }}>
                  {note.preview_text}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Topics: {note.topics.length > 0 ? note.topics.join(', ') : 'N/A'}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-start' }}>
                <Button variant="contained" onClick={() => onSelectNote(note.id)} color="primary" sx={{ textTransform: 'none' }}>
                  View Details & Resources
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default NoteList;


