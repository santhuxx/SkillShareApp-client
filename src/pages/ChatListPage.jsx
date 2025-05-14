import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Fade,
  Paper,
  Container,
  Stack,
  Button,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NavBar from '../components/Navbar';
import SideMenu from '../components/SideMenu';

const ChatListPage = () => {
  const navigate = useNavigate();
  const [chatSessions, setChatSessions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        const sessionsResponse = await axios.get('http://localhost:8080/api/chat/sessions', {
          withCredentials: true,
        });

        const { currentUserId, sessions } = sessionsResponse.data;
        setCurrentUserId(currentUserId);

        const sessionsWithMessages = await Promise.all(
          sessions.map(async (session) => {
            const otherUserId = session.otherUserId;
            try {
              const messagesResponse = await axios.get(
                `http://localhost:8080/api/chat/messages/${otherUserId}`,
                { withCredentials: true }
              );
              const messages = messagesResponse.data;
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
              return {
                ...session,
                lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
                lastMessageTime: lastMessage ? lastMessage.timestamp : session.lastUpdated,
              };
            } catch (err) {
              return {
                ...session,
                lastMessage: 'No messages yet',
                lastMessageTime: session.lastUpdated,
              };
            }
          })
        );

        sessionsWithMessages.sort((a, b) => 
          new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        setChatSessions(sessionsWithMessages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch chat sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, []);

  const handleSessionClick = (otherUserId) => {
    navigate(`/message/${otherUserId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.900'}}>
        <SideMenu />
        <Box sx={{ flexGrow: 1, ml: { xs: 0, md: '240px' }, transition: 'margin-left 0.3s' }}>
          <NavBar />
          <Box
            sx={{
              
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 64px)',
              bgcolor: 'grey.900',
            }}
          >
            <CircularProgress size={60} sx={{ color: 'primary.light' }} />
            <Typography sx={{ mt: 2, color: 'grey.300', fontWeight: 'medium' }}>
              Loading chat sessions...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.900' }}>
        <SideMenu />
        <Box sx={{ flexGrow: 1, ml: { xs: 0, md: '240px' }, transition: 'margin-left 0.3s' }}>
          <NavBar />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 64px)',
              bgcolor: 'grey.900',
            }}
          >
            <Alert
              severity="error"
              sx={{ maxWidth: '500px', bgcolor: 'error.dark', color: 'white', borderRadius: 2, boxShadow: 1 }}
            >
              {error}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.900',mt: 10 }}>
      <SideMenu />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: '240px' }, transition: 'margin-left 0.3s' }}>
        <NavBar />
        <Fade in={true} timeout={800}>
          <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper
              elevation={8}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                bgcolor: 'grey.800',
                color: 'white',
                background: 'linear-gradient(145deg,rgb(37, 39, 42) 0%,rgb(37, 37, 38) 100%)',
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
                Your Chats
              </Typography>

              {chatSessions.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    color: 'grey.300',
                  }}
                >
                  <ChatIcon sx={{ fontSize: 48, mb: 2, color: 'primary.light' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                    No chats yet
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
                    Start a conversation by messaging someone!
                  </Typography>
                </Box>
              ) : (
                <List sx={{ bgcolor: 'transparent' }}>
                  {chatSessions.map((session, index) => (
                    <React.Fragment key={session.id}>
                      <ListItem
                        component="div"
                        onClick={() => handleSessionClick(session.otherUserId)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: 'grey.700',
                          '&:hover': {
                            bgcolor: 'grey.600',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                          },
                          transition: 'all 0.3s',
                          cursor: 'pointer',
                          p: 2,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              width: 48,
                              height: 48,
                            }}
                          >
                            {(session.otherUsername || session.otherUserId).charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                color: 'white',
                                fontSize: '1.1rem',
                              }}
                            >
                              {session.otherUsername || session.otherUserId}
                            </Typography>
                          }
                          secondary={
                            <Stack direction="column">
                              <Typography
                                sx={{
                                  color: 'grey.300',
                                  fontSize: '0.9rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '80%',
                                }}
                              >
                                {session.lastMessage}
                              </Typography>
                              <Typography
                                sx={{
                                  color: 'grey.400',
                                  fontSize: '0.8rem',
                                  mt: 0.5,
                                }}
                              >
                                {new Date(session.lastMessageTime).toLocaleString([], {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                })}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                      {index < chatSessions.length - 1 && (
                        <Divider sx={{ bgcolor: 'grey.600', my: 1 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Container>
        </Fade>
      </Box>
    </Box>
  );
};

export default ChatListPage;