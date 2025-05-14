import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Menu,
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
  const [sortOption, setSortOption] = useState("oldest");
  const [groupOption, setGroupOption] = useState("none");
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [receiverUsername, setReceiverUsername] = useState(userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch username
        const usernameResponse = await axios.get(
          `http://localhost:8080/api/chat/username/${userId}`,
          { withCredentials: true }
        );
        setReceiverUsername(usernameResponse.data.username);

        // Fetch messages
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

  const filteredMessages = messages
    .filter((msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOption === "newest"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
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
          backgroundColor: "#f8f9fa",
        }}
      >
        <CircularProgress sx={{ color: "#007AFF" }} />
        <Typography variant="body1" sx={{ mt: 2, color: "#666" }}>
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
          backgroundColor: "#f8f9fa",
        }}
      >
        <Alert severity="error" sx={{ mb: 2, width: "80%", maxWidth: "400px" }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="error"
          onClick={() => window.location.reload()}
          sx={{ textTransform: "none" }}
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
        height: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      <NavBar />
      <Box
        sx={{
          width: "250px",
          height: "100vh",
          position: "fixed",
          top: "56px",
          left: 0,
          backgroundColor: "white",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          "@media (max-width: 960px)": {
            width: "200px",
          },
          "@media (max-width: 600px)": {
            width: "60px",
          },
        }}
      >
        <SideMenu />
      </Box>
      <Box
        sx={{
          flex: 1,
          marginLeft: "250px",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          "@media (max-width: 960px)": {
            marginLeft: "200px",
          },
          "@media (max-width: 600px)": {
            marginLeft: "60px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            mt: "56px",
            "@media (max-width: 600px)": {
              flexDirection: "column",
              p: 1,
              gap: 1,
            },
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
              },
            }}
          />
        </Box>
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "white",
            "@media (max-width: 600px)": {
              p: 1,
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#333",
              fontWeight: 600,
              "@media (max-width: 600px)": {
                fontSize: "18px",
              },
            }}
          >
            Chat with {receiverUsername}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            backgroundColor: "white",
            "@media (max-width: 600px)": {
              p: 1,
            },
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
                color: "#666",
                "@media (max-width: 600px)": {
                  height: "60vh",
                },
              }}
            >
              <Typography sx={{ fontSize: "48px", mb: 1 }}>💬</Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                No messages yet
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
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
                      "@media (max-width: 600px)": {
                        mb: 1,
                      },
                    }}
                  >
                    {editingMessageId === message.id ? (
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: "75%",
                          backgroundColor: "#f5f5f5",
                          p: 2,
                          borderRadius: "12px",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          "@media (max-width: 600px)": {
                            maxWidth: "90%",
                            p: 1.5,
                          },
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
                              background: "white",
                              "@media (max-width: 600px)": {
                                fontSize: "14px",
                              },
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
                              color: "#666",
                              "@media (max-width: 600px)": {
                                padding: "6px 12px",
                                fontSize: "14px",
                              },
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleEditMessage(message.id)}
                            sx={{
                              textTransform: "none",
                              background: "#007AFF",
                              "&:hover": { background: "#0066CC" },
                              "@media (max-width: 600px)": {
                                padding: "6px 12px",
                                fontSize: "14px",
                              },
                            }}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          maxWidth: "75%",
                          p: 2,
                          borderRadius: "18px",
                          backgroundColor: isCurrentUser ? "#007AFF" : "#F1F1F1",
                          color: isCurrentUser ? "white" : "#333",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          position: "relative",
                          "@media (max-width: 600px)": {
                            maxWidth: "90%",
                            p: 1.5,
                            borderRadius: "15px",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            mb: 0.5,
                            "@media (max-width: 600px)": {
                              fontSize: "13px",
                            },
                          }}
                        >
                          {isCurrentUser ? "You" : (message.senderUsername || message.senderId)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            lineHeight: 1.4,
                            "@media (max-width: 600px)": {
                              fontSize: "14px",
                            },
                          }}
                        >
                          {message.content}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                            fontSize: "11px",
                            opacity: 0.8,
                            "@media (max-width: 600px)": {
                              fontSize: "10px",
                            },
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
                                background: "rgba(0,0,0,0.1)",
                                p: "2px 5px",
                                borderRadius: "3px",
                                "@media (max-width: 600px)": {
                                  p: "1px 4px",
                                  fontSize: "9px",
                                },
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
                              background: "white",
                              p: 0.2,
                              borderRadius: "12px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              "@media (max-width: 600px)": {
                                p: 0.1,
                              },
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(event) => handleOpenMenu(event, message.id)}
                              sx={{
                                color: "#666",
                                "&:hover": { color: "#007AFF" },
                                p: 0.3,
                                "@media (max-width: 600px)": {
                                  p: 0.2,
                                },
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
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: "6px",
              minWidth: "100px",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              const message = messages.find((msg) => msg.id === selectedMessageId);
              if (message) startEditing(message);
            }}
            sx={{ color: "#007AFF", fontSize: "12px", py: 0.5 }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDeleteMessage(selectedMessageId);
              handleCloseMenu();
            }}
            sx={{ color: "#d32f2f", fontSize: "12px", py: 0.5 }}
          >
            Delete
          </MenuItem>
        </Menu>
        <Box
          sx={{
            p: 2,
            backgroundColor: "white",
            borderTop: "1px solid #e0e0e0",
            boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.05)",
            "@media (max-width: 600px)": {
              p: 1,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              backgroundColor: "#f5f5f5",
              borderRadius: "25px",
              p: 1,
              "@media (max-width: 600px)": {
                flexDirection: "column",
                borderRadius: "20px",
                p: 0.5,
              },
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
                  background: "white",
                  "&:hover": { borderColor: "#007AFF" },
                  "&.Mui-focused": { borderColor: "#007AFF" },
                  "@media (max-width: 600px)": {
                    fontSize: "14px",
                    "& .MuiOutlinedInput-root": { borderRadius: "15px" },
                  },
                },
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{
                background: "#007AFF",
                "&:hover": { background: "#0066CC" },
                "&:disabled": { background: "#cccccc", cursor: "not-allowed" },
                borderRadius: "20px",
                minWidth: "50px",
                "@media (max-width: 600px)": {
                  borderRadius: "15px",
                  minWidth: "100%",
                  padding: "8px",
                },
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagePage;