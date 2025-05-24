import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";

const MessagePage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [receiverUsername, setReceiverUsername] = useState(userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usernameResponse = await axios.get(
          `http://localhost:8080/api/chat/username/${userId}`,
          { withCredentials: true }
        );
        setReceiverUsername(usernameResponse.data.username);

        const messagesResponse = await axios.get(
          `http://localhost:8080/api/chat/messages/${userId}`,
          { withCredentials: true }
        );
        setMessages(messagesResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/chat/message",
        null,
        {
          params: {
            receiverId: userId,
            content: newMessage,
          },
          withCredentials: true,
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editContent.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/chat/message/${messageId}`,
        null,
        {
          params: {
            newContent: editContent,
          },
          withCredentials: true,
        }
      );

      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, content: editContent, edited: true } : msg
        )
      );
      setEditingMessageId(null);
      setEditContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update message");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/chat/message/${messageId}`,
        { withCredentials: true }
      );

      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete message");
    }
  };

  const startEditing = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
    handleCloseMenu();
  };

  const handleOpenMenu = (event, messageId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessageId(messageId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMessageId(null);
  };

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "#121212",
        }}
      >
        <CircularProgress sx={{ color: "#ffffff" }} />
        <Typography variant="body1" sx={{ mt: 2, color: "#b0b0b0" }}>
          Loading messages...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "#121212",
        }}
      >
        <Alert severity="error" sx={{ bgcolor: "#2c2c2c", color: "#ffffff", mb: 2, width: "80%", maxWidth: "400px" }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            bgcolor: "#0288d1",
            color: "#ffffff",
            "&:hover": { bgcolor: "#039be5" },
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#121212",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      <SideMenu />
      <Box sx={{ flex: 1, ml: "240px" }}>
        <NavBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 64px)", // Subtract NavBar height
            mt: 8,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              bgcolor: "#1e1e1e",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  bgcolor: "#252525",
                  color: "#e0e0e0",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#333333" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0288d1" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0288d1" },
                },
                "& .MuiInputLabel-root": { color: "#b0b0b0" },
              }}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #333333",
              bgcolor: "#1e1e1e",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              Chat with {receiverUsername}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              bgcolor: "#121212",
              pb: "80px", // Space for fixed input area
            }}
          >
            {filteredMessages.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#b0b0b0",
                }}
              >
                <Typography sx={{ fontSize: "48px", mb: 1 }}>💬</Typography>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: "#ffffff" }}>
                  No messages yet
                </Typography>
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  Send a message to start the conversation!
                </Typography>
              </Box>
            ) : (
              <>
                {filteredMessages.map((message) => {
                  const isCurrentUser = message.senderId !== userId;

                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                        mb: 2,
                        animation: "fadeIn 0.3s ease-in",
                      }}
                    >
                      {editingMessageId === message.id ? (
                        <Box
                          sx={{
                            maxWidth: "70%",
                            bgcolor: "#252525",
                            p: 2,
                            borderRadius: "16px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <TextField
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                bgcolor: "#333333",
                                color: "#e0e0e0",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#333333" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0288d1" },
                              },
                            }}
                            autoFocus
                          />
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => setEditingMessageId(null)}
                              sx={{
                                textTransform: "none",
                                color: "#b0b0b0",
                                borderColor: "#b0b0b0",
                                "&:hover": { borderColor: "#0288d1", bgcolor: "#0288d133" },
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => handleEditMessage(message.id)}
                              disabled={!editContent.trim()}
                              sx={{
                                textTransform: "none",
                                bgcolor: "#0288d1",
                                color: "#ffffff",
                                "&:hover": { bgcolor: "#039be5" },
                                "&:disabled": { bgcolor: "#cccccc", cursor: "not-allowed" },
                              }}
                            >
                              Save
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            maxWidth: "70%",
                            p: 2,
                            borderRadius: "16px",
                            bgcolor: isCurrentUser ? "#0288d1" : "#333333",
                            color: isCurrentUser ? "#ffffff" : "#e0e0e0",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                            position: "relative",
                            "&:hover": {
                              bgcolor: isCurrentUser ? "#039be5" : "#3a3a3a",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              mb: 0.5,
                              color: "#ffffff",
                            }}
                          >
                            {isCurrentUser ? "You" : (message.senderUsername || message.senderId)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              lineHeight: 1.4,
                            }}
                          >
                            {message.content}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mt: 1,
                              fontSize: "12px",
                              color: "#b0b0b0",
                            }}
                          >
                            <Typography>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                            {message.edited && (
                              <Typography
                                sx={{
                                  bgcolor: "rgba(0,0,0,0.2)",
                                  p: "2px 5px",
                                  borderRadius: "3px",
                                }}
                              >
                                edited
                              </Typography>
                            )}
                          </Box>
                          {isCurrentUser && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: "-8px",
                                right: 0,
                                bgcolor: "#1e1e1e",
                                p: 0.2,
                                borderRadius: "12px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={(event) => handleOpenMenu(event, message.id)}
                                sx={{
                                  color: "#b0b0b0",
                                  "&:hover": { color: "#0288d1" },
                                  p: 0.3,
                                }}
                              >
                                <MoreVertIcon sx={{ fontSize: "16px" }} />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: "240px",
              right: 0,
              p: 2,
              bgcolor: "#1e1e1e",
              borderTop: "1px solid #333333",
              boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                bgcolor: "#252525",
                borderRadius: "25px",
                p: 1,
                maxWidth: "lg",
                mx: "auto",
              }}
            >
              <TextField
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    bgcolor: "#333333",
                    color: "#e0e0e0",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#333333" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0288d1" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0288d1" },
                  },
                  "& .MuiInputLabel-root": { color: "#b0b0b0" },
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  bgcolor: "#0288d1",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#039be5" },
                  "&:disabled": { bgcolor: "#cccccc", cursor: "not-allowed" },
                  borderRadius: "20px",
                  minWidth: "50px",
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            bgcolor: "#1e1e1e",
            borderRadius: "6px",
            minWidth: "100px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            const message = messages.find((msg) => msg.id === selectedMessageId);
            if (message) startEditing(message);
          }}
          sx={{ color: "#0288d1", fontSize: "12px", py: 0.5 }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteMessage(selectedMessageId);
            handleCloseMenu();
          }}
          sx={{ color: "#ff5252", fontSize: "12px", py: 0.5 }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MessagePage;
