import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts', {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          My Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-post')}
        >
          Create Post
        </Button>
      </Grid>

      {posts.length === 0 ? (
        <Grid container direction="column" alignItems="center" sx={{ mt: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            You haven't created any posts yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-post')}
          >
            Create Your First Post
          </Button>
        </Grid>
      ) : (
        <Grid container direction="column" spacing={4}>
          {posts.map((post) => (
            <Grid item key={post.id}>
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {post.title.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  action={
                    <>
                      <IconButton onClick={() => navigate(`/edit-post/${post.id}`)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(post.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  }
                  title={post.title}
                  subheader={`Posted on: ${new Date(post.createdAt).toLocaleDateString()}`}
                />

                {post.imageUrls?.length > 0 && (
                  <Grid container spacing={0}>
                    {post.imageUrls.map((imageUrl, index) => (
                      <Grid item xs={4} key={index}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={imageUrl}
                          alt={`Post ${post.id} image ${index + 1}`}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {post.videoUrl && (
                  <CardMedia component="video" controls src={post.videoUrl} sx={{ maxHeight: 500 }} />
                )}

                <CardContent>
                  <Typography variant="body1" color="textPrimary">
                    {post.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyPosts;