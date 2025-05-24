"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Box,
  Typography,
  Avatar,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ArticleIcon from "@mui/icons-material/Article"
import BookIcon from "@mui/icons-material/Book"
import SettingsIcon from "@mui/icons-material/Settings"
import { MailIcon } from "lucide-react"
import NotificationsIcon from "@mui/icons-material/Notifications"

const SideMenu = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios
      .get("http://localhost:8080/user-info", { withCredentials: true })
      .then((response) => {
        setUser(response.data)
      })
      .catch((error) => {
        console.error("Error fetching user data:", error)
      })
  }, [])

  const handleNavigateProfile = () => {
    navigate("/profile")
  }

  const handleNavigateMyPosts = () => {
    navigate("/myposts")
  }

  const handleNavigateMyLearningPlans = () => {
    navigate("/mylearningplans")
  }

  const handleNavigateMessages = () => {
    navigate("/chat")
  }

  const handleNavigateNotifications = () => {
    navigate("/notifications")
  }

  const handleNavigateSettings = () => {
    navigate("/settings")
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 64,
        left: 0,
        width: 240,
        height: "100vh",
        backgroundColor: "#121212",
        color: "#b0b0b0",
        display: "flex",
        flexDirection: "column",
        pt: 2,
        zIndex: 1100,
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1.5,
          mb: 2,
          "&:hover": {
            backgroundColor: "#1e1e1e",
            cursor: "pointer",
          },
          transition: "background-color 0.2s ease",
        }}
        onClick={handleNavigateProfile}
      >
        {user ? (
          <Avatar
            src={user.picture}
            alt={user.name || "User"}
            sx={{ width: 36, height: 36, mr: 1.5, bgcolor: "#333333" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: "#333333", color: "#ffffff" }} />
        )}
        <Typography variant="body1" sx={{ fontWeight: 600, color: "#ffffff" }}>
          {user ? user.name : "User"}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search Skill Share App"
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "#b0b0b0", mr: 1 }} />,
            sx: {
              backgroundColor: "#1e1e1e",
              borderRadius: 20,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover": { backgroundColor: "#252525" },
              color: "#e0e0e0",
              fontSize: 14,
            },
          }}
          sx={{ input: { color: "#e0e0e0" } }}
        />
      </Box>

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <List sx={{ mt: 1, flexGrow: 1 }}>
          <ListItem
            button
            onClick={handleNavigateMyPosts}
            sx={{
              "&:hover": {
                backgroundColor: "#1e1e1e",
                color: "#ff5252",
                "& .MuiListItemIcon-root": {
                  color: "#ff5252",
                },
              },
              color: "#b0b0b0",
              px: 3,
              py: 1.2,
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#b0b0b0" }}>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="My Posts" sx={{ color: "inherit" }} />
          </ListItem>
          <ListItem
            button
            onClick={handleNavigateMyLearningPlans}
            sx={{
              "&:hover": {
                backgroundColor: "#1e1e1e",
                color: "#ff5252",
                "& .MuiListItemIcon-root": {
                  color: "#ff5252",
                },
              },
              color: "#b0b0b0",
              px: 3,
              py: 1.2,
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#b0b0b0" }}>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="My Learning Plans" sx={{ color: "inherit" }} />
          </ListItem>
          <ListItem
            button
            onClick={handleNavigateMessages}
            sx={{
              "&:hover": {
                backgroundColor: "#1e1e1e",
                color: "#ff5252",
                "& .MuiListItemIcon-root": {
                  color: "#ff5252",
                },
              },
              color: "#b0b0b0",
              px: 3,
              py: 1.2,
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#b0b0b0" }}>
              <MailIcon className="lucide-icon" />
            </ListItemIcon>
            <ListItemText primary="Messages" sx={{ color: "inherit" }} />
          </ListItem>
          <ListItem
            button
            onClick={handleNavigateNotifications}
            sx={{
              "&:hover": {
                backgroundColor: "#1e1e1e",
                color: "#ff5252",
                "& .MuiListItemIcon-root": {
                  color: "#ff5252",
                },
              },
              color: "#b0b0b0",
              px: 3,
              py: 1.2,
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#b0b0b0" }}>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" sx={{ color: "inherit" }} />
          </ListItem>
        </List>

        {/* Settings Item at Bottom */}
        <List sx={{ mt: "auto", pb: 10 }}>
          <ListItem
            button
            onClick={handleNavigateSettings}
            sx={{
              backgroundColor: "#1e1e1e",
              color: "#ff5252",
              "& .MuiListItemIcon-root": {
                color: "#ff5252",
              },
              "&:hover": {
                backgroundColor: "#252525",
                color: "#ff5252",
                "& .MuiListItemIcon-root": {
                  color: "#ff5252",
                },
              },
              px: 3,
              py: 1.2,
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#ff5252" }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={{ color: "inherit" }} />
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}

export default SideMenu
