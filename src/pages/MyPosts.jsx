import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, Typography, Button, Card, CardMedia, CardContent, 
  CardHeader, Avatar, CircularProgress, Alert, Box, 
  IconButton, Menu, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatDistanceToNow } from 'date-fns';

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
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4} direction="column" alignItems="center">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <Grid item xs={12} key={post.id} sx={{ width: '100%' }}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: 'hidden',
                  mb: 4,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                  width: 430,
                  mx: 'auto'
                }}
              >
                {/* Header */}
                <CardHeader
                  avatar={<Avatar>{post.title?.charAt(0).toUpperCase()}</Avatar>}
                  action={
                    <IconButton onClick={(e) => handleMenuOpen(e, post.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {post.title}
                    </Typography>
                  }
                  subheader={
                    post.createdAt 
                      ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) 
                      : ''
                  }
                />

                {/* Description */}
                <CardContent sx={{ pt: 0 }}>
                  <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                    {post.description}
                  </Typography>

                  {/* Media grid: 2 per row */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 200px)',
                      gap: 0,
                      justifyContent: 'start'
                    }}
                  >
                    {post.imageUrls && post.imageUrls.map((url, index) => (
                      <Box
                        key={`image-${index}`}
                        component="img"
                        src={url}
                        alt={`Post Image ${index + 1}`}
                        sx={{
                          width: 200,
                          height: 200,
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
                          width: 200,
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 0,
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid container direction="column" alignItems="center" sx={{ mt: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              You haven't created any posts yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/createpost')}
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
      >
        <MenuItem onClick={handleUpdatePost}>Update</MenuItem>
        <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default MyPosts;