import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
  Collapse,
  Alert,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Send,
  MoreVert,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const PostInteractions = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  const menuAnchorRef = useRef(null);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      setLikesLoading(true);
      try {
        const likeResponse = await axios.get(`http://localhost:8080/api/likes/${postId}/status`, {
          withCredentials: true,
        });
        setLiked(likeResponse.data.hasLiked);
        setLikeCount(likeResponse.data.likeCount);
      } catch (err) {
        console.error('Error fetching like status:', err);
        setLiked(false);
        setLikeCount(0);
      } finally {
        setLikesLoading(false);
      }
    };

    fetchLikeStatus();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      setCommentsLoading(true);
      try {
        const commentsResponse = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
          withCredentials: true,
        });

        if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
          setComments(commentsResponse.data);
        } else {
          setComments([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Unable to load comments. Please try again later.');
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
    const intervalId = setInterval(fetchComments, 30000);
    return () => clearInterval(intervalId);
  }, [postId]);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await axios.delete(`http://localhost:8080/api/likes/${postId}`, {
          withCredentials: true,
        });
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await axios.post(`http://localhost:8080/api/likes/${postId}`, {}, {
          withCredentials: true,
        });
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Unable to update like status. Please try again.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/comments/${postId}?content=${encodeURIComponent(newComment)}`,
        {},
        { withCredentials: true }
      );

      if (response.data) {
        setComments((prev) => [...prev, response.data]);
      }
      setNewComment('');
      setError(null);

      const refreshResponse = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
        withCredentials: true,
      });

      if (refreshResponse.data && Array.isArray(refreshResponse.data)) {
        setComments(refreshResponse.data);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentMenuOpen = (event, comment) => {
    menuAnchorRef.current = event.currentTarget;
    setSelectedComment(comment);
    setAnchorEl(event.currentTarget);
  };

  const handleCommentMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditComment = () => {
    if (selectedComment) {
      setEditMode(true);
      setEditContent(selectedComment.content);
      handleCommentMenuClose();
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !selectedComment) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/comments/${selectedComment.id}?content=${encodeURIComponent(
          editContent
        )}`,
        {},
        { withCredentials: true }
      );

      if (response.data) {
        setComments(comments.map((comment) =>
          comment.id === selectedComment.id ? response.data : comment
        ));
      }

      setEditMode(false);
      setSelectedComment(null);
      setEditContent('');
      setError(null);
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/comments/${selectedComment.id}`, {
        withCredentials: true,
      });

      setComments(comments.filter((comment) => comment.id !== selectedComment.id));
      setError(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
    } finally {
      setLoading(false);
      handleCommentMenuClose();
      setSelectedComment(null);
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`, {
          withCredentials: true,
        });
        setComments(response.data || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Unable to load comments. Please try again later.');
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    setShowComments(!showComments);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <Box sx={{ mt: 0 }}>
      <Divider />

      {/* Like and Comment Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          py: 1,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          mx: 2,
        }}
      >
        <Button
          onClick={handleLikeToggle}
          disabled={likesLoading}
          startIcon={
            likesLoading ? (
              <CircularProgress size={16} />
            ) : liked ? (
              <Favorite sx={{ color: '#1877F2' }} />
            ) : (
              <FavoriteBorder />
            )
          }
          sx={{
            textTransform: 'none',
            color: liked ? '#1877F2' : '#65676b',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#e8ecef',
            },
            borderRadius: 2,
            px: 2,
            py: 0.5,
          }}
        >
          Like {likeCount > 0 && `(${likeCount})`}
        </Button>
        <Button
          onClick={toggleComments}
          startIcon={<ChatBubbleOutline />}
          sx={{
            textTransform: 'none',
            color: '#65676b',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#e8ecef',
            },
            borderRadius: 2,
            px: 2,
            py: 0.5,
          }}
        >
          Comment {comments.length > 0 && `(${comments.length})`}
        </Button>
      </Box>

      <Divider />

      {/* Comments Section */}
      <Collapse in={showComments}>
        {commentsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ my: 1 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <List sx={{ py: 0 }}>
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <React.Fragment key={comment.id || `temp-${Math.random()}`}>
                    {editMode && selectedComment?.id === comment.id ? (
                      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          variant="outlined"
                          disabled={loading}
                        />
                        <Button onClick={handleSaveEdit} sx={{ ml: 1 }} disabled={loading}>
                          {loading ? <CircularProgress size={16} /> : 'Save'}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditMode(false);
                            setSelectedComment(null);
                            setEditContent('');
                          }}
                          sx={{ ml: 1 }}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <ListItem
                        alignItems="flex-start"
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={(e) => handleCommentMenuOpen(e, comment)}
                            id={`comment-menu-button-${comment.id}`}
                            aria-controls={
                              Boolean(anchorEl) && selectedComment?.id === comment.id
                                ? `comment-menu-${comment.id}`
                                : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={
                              Boolean(anchorEl) && selectedComment?.id === comment.id ? 'true' : undefined
                            }
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>{comment.userId?.charAt(0) || 'U'}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component="span" variant="body2" fontWeight="bold">
                              {comment.userId || 'Unknown User'}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                display="block"
                              >
                                {comment.content || ''}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {formatTimestamp(comment.createdAt)}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </List>

            <Menu
              id={selectedComment ? `comment-menu-${selectedComment.id}` : undefined}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCommentMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              MenuListProps={{
                'aria-labelledby': selectedComment ? `comment-menu-button-${selectedComment.id}` : undefined,
              }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: { minWidth: 120 },
                },
              }}
              container={document.body}
              disableScrollLock={true}
            >
              <MenuItem onClick={handleEditComment}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
            </Menu>

            {!editMode && (
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  variant="outlined"
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 5,
                      backgroundColor: '#f0f2f5',
                      '&:hover': {
                        backgroundColor: '#e8ecef',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    },
                  }}
                />
                <IconButton type="submit" sx={{ ml: 1 }} disabled={loading || !newComment.trim()}>
                  {loading ? <CircularProgress size={16} /> : <Send />}
                </IconButton>
              </Box>
            )}
          </>
        )}
      </Collapse>
    </Box>
  );
};

export default PostInteractions;