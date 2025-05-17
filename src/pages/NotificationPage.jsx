import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/notifications", {
          withCredentials: true,
        });
        console.log("Notifications response:", response.data);
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err.response?.data || err);
        setError(err.response?.data?.message || "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        null,
        { withCredentials: true }
      );
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark notification as read");
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

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
          Loading notifications...
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
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "white",
            mt: "56px",
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
            Notifications
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
          {notifications.length === 0 ? (
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
              <NotificationsIcon sx={{ fontSize: "48px", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                No notifications
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                You'll see notifications for likes and comments here.
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification) => (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.isRead ? "white" : "#e8f0fe",
                      borderRadius: "8px",
                      mb: 1,
                      "&:hover": {
                        backgroundColor: notification.isRead ? "#f5f5f5" : "#d0e0fd",
                        cursor: "pointer",
                      },
                      "@media (max-width: 600px)": {
                        py: 1,
                      },
                    }}
                    onClick={() => handleViewPost(notification.postId)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            color: "#333",
                            "@media (max-width: 600px)": {
                              fontSize: "14px",
                            },
                          }}
                        >
                          {notification.content}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#666",
                            "@media (max-width: 600px)": {
                              fontSize: "11px",
                            },
                          }}
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      {!notification.isRead && (
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          sx={{
                            color: "#007AFF",
                            "@media (max-width: 600px)": {
                              p: 0.5,
                            },
                          }}
                        >
                          <CheckCircleIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationPage;