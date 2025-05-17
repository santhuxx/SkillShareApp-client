import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, TextField, Button, Typography, CircularProgress, Alert, Grid, 
  Card, CardMedia, IconButton, Fade, Container, Paper 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NavBar from '../components/Navbar';
import SideMenu from '../components/SideMenu';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
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
        setCurrentImages(data.imageUrls || []);
        setCurrentVideo(data.videoUrl || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).filter(file => !file.isEmpty);
    if (files.length + newImages.length + currentImages.length > 3) {
      setError('You can only upload up to 3 images total.');
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.isEmpty) {
      setNewVideo(file);
    }
  };

  const removeCurrentImage = (index) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCurrentVideo = () => {
    setCurrentVideo('');
  };

  const handleUpdate = async () => {
    setSaving(true);
    setError('');

    const formData = new FormData();
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('currentImageUrls', JSON.stringify(currentImages));
    newImages.forEach((image) => {
      formData.append('images', image);
    });
    if (newVideo) {
      formData.append('video', newVideo);
    }

    try {
      await axios.put(`http://localhost:8080/api/posts/${postId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/myposts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', bgcolor: 'grey.900' }}>
        <CircularProgress size={60} sx={{ color: 'primary.light' }} />
      </Grid>
    );
  }

  if (error && !post) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', bgcolor: 'grey.900' }}>
        <Alert severity="error" sx={{ maxWidth: '500px', bgcolor: 'error.dark', color: 'white', boxShadow: 6, borderRadius: 2 }}>
          {error}
        </Alert>
      </Grid>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.900' }}>
      <SideMenu />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: '240px' }, transition: 'margin-left 0.3s' }}>
        <NavBar />
        <Fade in={true} timeout={800}>
          <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper 
              elevation={6} 
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                bgcolor: 'grey.800', 
                color: 'white', 
                background: 'linear-gradient(145deg,rgb(22, 22, 22) 0%,rgb(39, 40, 40) 100%)' 
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, color: 'primary.light' }}>
                Edit Post
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, bgcolor: 'error.dark', color: 'white', borderRadius: 2, boxShadow: 1 }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: 'grey.700', 
                    color: 'white', 
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'grey.600' },
                    '&:hover fieldset': { borderColor: 'primary.light' },
                  },
                  '& .MuiInputLabel-root': { color: 'grey.400' },
                }}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: 'grey.700', 
                    color: 'white', 
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'grey.600' },
                    '&:hover fieldset': { borderColor: 'primary.light' },
                  },
                  '& .MuiInputLabel-root': { color: 'grey.400' },
                }}
              />

              <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'grey.300', mb: 2 }}>
                Current Images
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {currentImages.map((url, index) => (
                  <Grid item xs={12} sm={4} key={`current-${url}-${index}`}>
                    <Card 
                      sx={{ 
                        position: 'relative', 
                        borderRadius: 2, 
                        bgcolor: 'grey.700', 
                        boxShadow: 4, 
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={url}
                        alt={`Image ${index + 1}`}
                        sx={{ objectFit: 'cover', borderRadius: 2 }}
                      />
                      <IconButton
                        onClick={() => removeCurrentImage(index)}
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          bgcolor: 'error.main', 
                          color: 'white', 
                          '&:hover': { bgcolor: 'error.dark' },
                          boxShadow: 2,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'grey.300', mb: 2 }}>
                Upload New Images (Max 3 total)
              </Typography>
              <Box sx={{ mb: 3 }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid', 
                    borderColor: 'grey.600', 
                    borderRadius: '8px', 
                    backgroundColor: 'grey.700', 
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.light' },
                  }}
                />
              </Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {newImages.map((file, index) => (
                  <Grid item xs={12} sm={4} key={`new-${file.name}-${index}`}>
                    <Card 
                      sx={{ 
                        position: 'relative', 
                        borderRadius: 2, 
                        bgcolor: 'grey.700', 
                        boxShadow: 4, 
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={URL.createObjectURL(file)}
                        alt={`New Image ${index + 1}`}
                        sx={{ objectFit: 'cover', borderRadius: 2 }}
                      />
                      <IconButton
                        onClick={() => removeNewImage(index)}
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          bgcolor: 'error.main', 
                          color: 'white', 
                          '&:hover': { bgcolor: 'error.dark' },
                          boxShadow: 2,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'grey.300', mb: 2 }}>
                Current Video
              </Typography>
              {currentVideo && (
                <Box 
                  sx={{ 
                    mb: 3, 
                    position: 'relative', 
                    borderRadius: 2, 
                    boxShadow: 4, 
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                >
                  <video
                    width="100%"
                    height="240"
                    controls
                    src={currentVideo}
                    style={{ borderRadius: '8px' }}
                  />
                  <IconButton
                    onClick={removeCurrentVideo}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'error.main', 
                      color: 'white', 
                      '&:hover': { bgcolor: 'error.dark' },
                      boxShadow: 2,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'grey.300', mb: 2 }}>
                Upload New Video
              </Typography>
              <Box sx={{ mb: 3 }}>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid', 
                    borderColor: 'grey.600', 
                    borderRadius: '8px', 
                    backgroundColor: 'grey.700', 
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.light' },
                  }}
                />
              </Box>
              {newVideo && (
                <Box 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2, 
                    boxShadow: 4, 
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                >
                  <video
                    width="100%"
                    height="240"
                    controls
                    src={URL.createObjectURL(newVideo)}
                    style={{ borderRadius: '8px' }}
                  />
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdate}
                disabled={saving || (currentImages.length + newImages.length > 3)}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  '&:hover': { 
                    bgcolor: 'primary.dark', 
                    transform: 'translateY(-2px)', 
                    boxShadow: 4 
                  },
                  boxShadow: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  transition: 'all 0.3s',
                }}
              >
                {saving ? 'Saving...' : 'Update Post'}
              </Button>
            </Paper>
          </Container>
        </Fade>
      </Box>
    </Box>
  );
};

export default EditPost;