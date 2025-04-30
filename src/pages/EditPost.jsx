import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, TextField, Button, Typography, CircularProgress, Alert, Grid 
} from '@mui/material';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`, {
          withCredentials: true,
        });

        const data = response.data;
        setPost(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setImageUrls(data.imageUrls || []);
        setVideoUrl(data.videoUrl || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdate = async () => {
    setSaving(true);
    setError('');

    const formData = new FormData();
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (imageUrls.length > 0) {
      imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url.trim());
      });
    }
    if (videoUrl) formData.append('videoUrl', videoUrl);

    try {
      await axios.put(`http://localhost:8080/api/posts/${postId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/myposts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <Alert severity="error">{error}</Alert>
      </Grid>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Edit Post
      </Typography>

      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Image URLs (comma separated)"
        value={imageUrls.join(',')}
        onChange={(e) => setImageUrls(e.target.value.split(',').map((url) => url.trim()))}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleUpdate}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Update Post'}
      </Button>
    </Box>
  );
};

export default EditPost;