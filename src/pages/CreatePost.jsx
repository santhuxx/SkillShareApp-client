import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Card,
  CardMedia,
} from '@mui/material';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files.length > 3) {
      setError('You can upload a maximum of 3 images');
      return;
    }
    setImages([...e.target.files]);
    setError('');
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      images.forEach((image) => {
        formData.append('images', image);
      });
      
      if (video) {
        formData.append('video', video);
      }

      await axios.post('http://localhost:8080/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="md" mx="auto" my={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Create New Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />

          <Button
            variant="contained"
            component="label"
          >
            Upload Images (Max 3)
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </Button>

          {images.length > 0 && (
            <Stack direction="row" spacing={2}>
              {images.map((image, index) => (
                <Card key={index} sx={{ width: 100, height: 100 }}>
                  <CardMedia
                    component="img"
                    image={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </Stack>
          )}

          <Button
            variant="contained"
            component="label"
          >
            Upload Video
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoChange}
            />
          </Button>

          {video && (
            <Box mt={2}>
              <video controls width="100%" style={{ borderRadius: '8px' }}>
                <source src={URL.createObjectURL(video)} type={video.type} />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default CreatePost;