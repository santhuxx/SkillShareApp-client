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
  Fade,
  Paper,
  Container,
  Grid,
} from '@mui/material';
import NavBar from '../components/Navbar';
import SideMenu from '../components/SideMenu';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    if (files.length > 3) {
      setError('You can upload a maximum of 3 images');
      return;
    }
    setImages(files);
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.900' }}>
      <SideMenu />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: '240px' }, transition: 'margin-left 0.3s' }}>
        <NavBar />
        <Fade in={true} timeout={800}>
          <Container maxWidth="sm" sx={{ py: 5, mt: 10 }}>
            <Paper 
              elevation={8} 
              sx={{ 
                p: { xs: 3, sm: 4 }, 
                borderRadius: 3, 
                bgcolor: 'grey.800', 
                color: 'white', 
                background: 'linear-gradient(145deg,rgb(30, 30, 31) 0%,rgb(19, 20, 22) 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3, 
                  color: 'primary.light', 
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}
              >
                Create a New Post
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    bgcolor: 'error.dark', 
                    color: 'white', 
                    borderRadius: 2, 
                    boxShadow: 1,
                    py: 1,
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: 'grey.700', 
                        color: 'white', 
                        borderRadius: 2,
                        '& fieldset': { borderColor: 'grey.600' },
                        '&:hover fieldset': { borderColor: 'primary.light' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'grey.400' },
                      '& .MuiInputLabel-root.Mui-focused': { color: 'primary.light' },
                    }}
                  />

                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: 'grey.700', 
                        color: 'white', 
                        borderRadius: 2,
                        '& fieldset': { borderColor: 'grey.600' },
                        '&:hover fieldset': { borderColor: 'primary.light' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'grey.400' },
                      '& .MuiInputLabel-root.Mui-focused': { color: 'primary.light' },
                    }}
                  />

                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      bgcolor: 'grey.700',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': { 
                        bgcolor: 'grey.600', 
                        transform: 'translateY(-2px)', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
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
                    <Grid container spacing={2}>
                      {images.map((image, index) => (
                        <Grid item xs={4} key={index}>
                          <Card 
                            sx={{ 
                              width: '100%', 
                              height: 100, 
                              borderRadius: 2, 
                              bgcolor: 'grey.700', 
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', 
                              transition: 'transform 0.3s, box-shadow 0.3s',
                              '&:hover': { transform: 'scale(1.05)', boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)' },
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      bgcolor: 'grey.700',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': { 
                        bgcolor: 'grey.600', 
                        transform: 'translateY(-2px)', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
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
                    <Box 
                      sx={{ 
                        borderRadius: 2, 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', 
                        overflow: 'hidden',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.02)' },
                        maxWidth: 400, // Reduced video size for better proportionality
                        mx: 'auto',
                      }}
                    >
                      <video 
                        controls 
                        width="100%" 
                        style={{ 
                          borderRadius: '8px', 
                          maxHeight: 200, // Constrain height for compact preview
                        }}
                      >
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
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        borderColor: 'grey.600',
                        color: 'grey.300',
                        textTransform: 'none',
                        fontWeight: 'medium',
                        '&:hover': { 
                          borderColor: 'primary.light', 
                          color: 'primary.light', 
                          transform: 'translateY(-2px)', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': { 
                          bgcolor: 'primary.dark', 
                          transform: 'translateY(-2px)', 
                          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                        },
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s',
                      }}
                    >
                      {isLoading ? 'Creating...' : 'Create Post'}
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Paper>
          </Container>
        </Fade>
      </Box>
    </Box>
  );
};

export default CreatePost;