import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Avatar,
  TextField,
} from "@mui/material"
import ArticleIcon from "@mui/icons-material/Article"
import SchoolIcon from "@mui/icons-material/School"
import BookIcon from "@mui/icons-material/Book"
import HomeIcon from "@mui/icons-material/Home"
import SearchIcon from "@mui/icons-material/Search"
import MailIcon from "@mui/icons-material/Mail"
import NotificationsIcon from "@mui/icons-material/Notifications"

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
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

  const handleNavigateCreate = () => {
    navigate("/createpost")
  }

  const handleNavigateProfile = () => {
    navigate("/profile")
  }

  const handleNavigateMyPosts = () => {
    navigate("/myposts")
  }

  const handleNavigationMyLearningPlans = () => {
    navigate("/mylearningplans")
  }

  const handleNavigationChats = () => {
    navigate("/chat")
  }

  const isHomePage = location.pathname === "/"
  const isMyLearningPlansPage = location.pathname === "/mylearningplans"
  const isMyPostsPage = location.pathname === "/myposts"
  const isMessagesPage = location.pathname === "/chat"
  

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#242526",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          minHeight: 56,
          px: 2,
        }}
      >
        {/* Left Side: Skill Share App Text and Search Bar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: "bold", fontSize: 20 }}
          >
            Skill Share App
          </Typography>
        </Box>

        {/* Center: Navigation Icons (including Messages and Notifications) */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Tooltip title="Home">
            <IconButton
              color="inherit"
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: isHomePage ? "rgba(24, 119, 242, 0.2)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#1877F2" },
                borderRadius: "50%",
                p: 0.5,
                color: isHomePage ? "#1877F2" : "#b0b3b8",
              }}
            >
              <HomeIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="My Posts">
            <IconButton
              color="inherit"
              onClick={handleNavigateMyPosts}
              sx={{
                backgroundColor: isMyPostsPage ? "rgba(24, 119, 242, 0.2)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#1877F2" },
                borderRadius: "50%",
                p: 0.5,
                color: isMyPostsPage ? "#1877F2" : "#b0b3b8",
              }}
            >
              <ArticleIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="My Learning Plans">
            <IconButton
              color="inherit"
              onClick={handleNavigationMyLearningPlans}
              sx={{
                backgroundColor: isMyLearningPlansPage ? "rgba(24, 119, 242, 0.2)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#1877F2" },
                borderRadius: "50%",
                p: 0.5,
                color: isMyLearningPlansPage ? "#1877F2" : "#b0b3b8",
              }}
            >
              <BookIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Messages">
            <IconButton
              color="inherit"
              onClick={handleNavigationChats}
              sx={{
                backgroundColor: isMessagesPage ? "rgba(24, 119, 242, 0.2)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#1877F2" },
                borderRadius: "50%",
                p: 0.5,
                color: isMessagesPage ? "#1877F2" : "#b0b3b8",
              }}
            >
              <MailIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#1877F2" },
                borderRadius: "50%",
                p: 0.5,
                color: "#b0b3b8",
                position: "relative",
              }}
            >
              <NotificationsIcon sx={{ fontSize: 24 }} />
              <Box
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  backgroundColor: "#e41e3f",
                  borderRadius: "50%",
                  border: "2px solid #242526",
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right Side: User Avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user ? (
            <Tooltip title={user.name || "Profile"}>
              <IconButton
                onClick={handleNavigateProfile}
                sx={{
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  borderRadius: "50%",
                }}
              >
                <Avatar
                  src={user.picture}
                  alt={user.name || "User"}
                  sx={{
                    width: 32,
                    height: 32,
                    border: "2px solid #242526",
                  }}
                  referrerPolicy="no-referrer"
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Profile">
              <IconButton
                onClick={handleNavigateProfile}
                sx={{
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  borderRadius: "50%",
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    border: "2px solid #242526",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar