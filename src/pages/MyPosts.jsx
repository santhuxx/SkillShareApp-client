import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, Typography, Button, Card, CardMedia, CardContent, 
  CardHeader, Avatar, CircularProgress, Alert, Box, 
  IconButton, Menu, MenuItem, Divider 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatDistanceToNow } from 'date-fns';
import PostInteractions from '../components/PostInteractions';
import NavBar from '../components/Navbar';
import SideMenu from '../components/SideMenu';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts', {
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else if (Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
        } else {
          setPosts([]);
          setError('Invalid data format from server.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleUpdatePost = () => {
    if (selectedPostId) {
      navigate(`/update-post/${selectedPostId}`);
    }
    handleMenuClose();
  };

  const handleDeletePost = async () => {
    if (selectedPostId) {
      try {
        await axios.delete(`http://localhost:8080/api/posts/${selectedPostId}`, {
          withCredentials: true,
        });

        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== selectedPostId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete post');
      }
    }
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh', bgcolor: '#121212' }}>
        <CircularProgress sx={{ color: '#ffffff' }} />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh', bgcolor: '#121212' }}>
        <Alert severity="error" sx={{ bgcolor: '#2c2c2c', color: '#ffffff' }}>
          {error}
        </Alert>
      </Grid>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#121212', minHeight: '100vh' }}>
      {/* Side Menu */}
      <SideMenu />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: '240px' }}>
        {/* Navigation Bar */}
        <NavBar />
        <Box sx={{ p: 3, mt: 8 }}>
          <Grid container spacing={4} direction="column" alignItems="center">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <Grid item xs={12} key={post.id} sx={{ width: '100%' }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      bgcolor: '#1e1e1e',
                      overflow: 'hidden',
                      mb: 4,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                      },
                      width: 630,
                      mx: 'auto',
                    }}
                  >
                    {/* Header */}
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: '#333333', color: '#ffffff' }}>
                          {post.title?.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      action={
                        <IconButton onClick={(e) => handleMenuOpen(e, post.id)} sx={{ color: '#b0b0b0', '&:hover': { color: '#ffffff' } }}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                          {post.title}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          {post.createdAt 
                            ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) 
                            : ''}
                        </Typography>
                      }
                    />

                    {/* Description */}
                    <CardContent sx={{ pt: 0 }}>
                      <Typography variant="body2" sx={{ mb: 2, color: '#e0e0e0' }}>
                        {post.description}
                      </Typography>
                      <Divider sx={{ my: 2, bgcolor: '#333333' }} />

                      {/* Media grid: 2 per row */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 300px)',
                          gap: 0,
                          justifyContent: 'start',
                        }}
                      >
                        {post.imageUrls && post.imageUrls.map((url, index) => (
                          <Box
                            key={`image-${index}`}
                            component="img"
                            src={url}
                            alt={`Post Image ${index + 1}`}
                            sx={{
                              width: 300,
                              height: 300,
                              objectFit: 'cover',
                              borderRadius: 0,
                            }}
                          />
                        ))}
                        {post.videoUrl && (
                          <Box
                            key="video"
                            component="video"
                            src={post.videoUrl}
                            controls
                            sx={{
                              width: 300,
                              height: 300,
                              objectFit: 'cover',
                              borderRadius: 0,
                              bgcolor: '#252525',
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>

                    {/* PostInteractions */}
                    <PostInteractions postId={post.id} />
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid container direction="column" alignItems="center" sx={{ mt: 8 }}>
                <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 2 }}>
                  You haven't created any posts yet.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/createpost')}
                  sx={{
                    bgcolor: '#ff5252',
                    color: '#ffffff',
                    '&:hover': { bgcolor: '#e04848' },
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                  }}
                >
                  Create Your First Post
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Menu for Update and Delete */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            container={document.body}
            disableScrollLock={true}
            slotProps={{
              paper: {
                sx: { bgcolor: '#1e1e1e', color: '#ffffff', minWidth: 120 },
              },
            }}
          >
            <MenuItem 
              onClick={handleUpdatePost}
              sx={{ color: '#ffffff', '&:hover': { bgcolor: '#333333' } }}
            >
              Update
            </MenuItem>
            <MenuItem 
              onClick={handleDeletePost}
              sx={{ color: '#ff5252', '&:hover': { bgcolor: '#333333' } }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default MyPosts;
