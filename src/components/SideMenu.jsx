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

  return (
    <Box
      sx={{
        position: "fixed",
        top: 63,
        left: 0,
        width: 240,
        height: "100vh",
        backgroundColor: "#242526",
        color: "#b0b3b8",
        display: "flex",
        flexDirection: "column",
        pt: 1, // Reduced top padding to bring profile section closer to the top
        zIndex: 1100,
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
          mb: 2, // Added margin-bottom for separation
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            cursor: "pointer",
          },
        }}
        onClick={handleNavigateProfile}
      >
        {user ? (
          <Avatar
            src={user.picture}
            alt={user.name || "User"}
            sx={{ width: 36, height: 36, mr: 1 }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <Avatar sx={{ width: 36, height: 36, mr: 1 }} />
        )}
        <Typography variant="body1" sx={{ fontWeight: 500, color: "white" }}>
          {user ? user.name : "User"}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: 2, mt: 1 }}>
        <TextField
          fullWidth
          placeholder="Search Skill Share App"
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "#b0b3b8", mr: 1 }} />,
            sx: {
              backgroundColor: "#3a3b3c",
              borderRadius: 20,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover": { backgroundColor: "#4a4b4c" },
              color: "#b0b3b8",
              fontSize: 14,
            },
          }}
          sx={{ input: { color: "#b0b3b8" } }}
        />
      </Box>

      {/* Navigation Links */}
      <List sx={{ mt: 2 }}>
        <ListItem
          button
          onClick={handleNavigateMyPosts}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#1877F2",
            },
            color: "#b0b3b8",
            px: 3,
            py: 1,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ArticleIcon sx={{ color: "inherit" }} />
          </ListItemIcon>
          <ListItemText primary="My Posts" sx={{ color: "inherit" }} />
        </ListItem>
        <ListItem
          button
          onClick={handleNavigateMyLearningPlans}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#1877F2",
            },
            color: "#b0b3b8",
            px: 3,
            py: 1,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <BookIcon sx={{ color: "inherit" }} />
          </ListItemIcon>
          <ListItemText primary="My Learning Plans" sx={{ color: "inherit" }} />
        </ListItem>
      </List>
    </Box>
  )
}

export default SideMenu