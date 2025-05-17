"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  CircularProgress,
  Alert,
  Box,
  Menu,
  MenuItem,
  Divider,
  TextField,
} from "@mui/material"
import { formatDistanceToNow } from "date-fns"
import PostInteractions from "../components/PostInteractions"
import NavBar from "../components/Navbar"
import SideMenu from "../components/SideMenu"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts/all", {
          withCredentials: true,
        })

        if (Array.isArray(response.data)) {
          setPosts(response.data)
        } else if (Array.isArray(response.data.posts)) {
          setPosts(response.data.posts)
        } else {
          setPosts([])
          setError("Invalid data format from server.")
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleProfileClick = (event, userId, postId) => {
    setAnchorEl(event.currentTarget)
    setSelectedPostId({ userId, postId })
    setOpenMenu(true)
  }

  const handleCloseMenu = () => {
    setOpenMenu(false)
    setAnchorEl(null)
  }

  const handleNavigateProfile = () => {
    navigate("/profile")
    handleCloseMenu()
  }

  const handleNavigateMessage = () => {
    if (!selectedPostId || !selectedPostId.userId) {
      console.error("No user selected")
      return
    }

    navigate(`/message/${selectedPostId.userId}`)
    handleCloseMenu()
  }

  if (isLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: "80vh" }}>
        <CircularProgress />
      </Grid>
    )
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: "80vh" }}>
        <Alert severity="error">{error}</Alert>
      </Grid>
    )
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Side Menu */}
      <SideMenu />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: "240px" }}>
        {/* Navigation Bar */}
        <NavBar />

        <Box sx={{ p: 3, mt: 8 }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            {/* Facebook-like Create Post Input */}
            <Box
              sx={{
                maxWidth: 500,
                mx: "auto",
                mb: 5,
              }}
            >
              <TextField
                placeholder="What's on your mind?"
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: {
                    borderRadius: 5,
                    backgroundColor: "#f0f2f5",
                    "&:hover": {
                      backgroundColor: "#e8ecef",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    color: "#65676b",
                    cursor: "pointer",
                    py: 1.5,
                  },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  },
                }}
                onClick={() => navigate("/createpost")}
              />
            </Box>
          </Box>

          <Grid container spacing={4} direction="column" alignItems="center">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <Grid item xs={12} key={post.id} sx={{ width: "100%" }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      overflow: "hidden",
                      mb: 4,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                      width: 630,
                      mx: "auto",
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          src={post.userImage}
                          onClick={(e) => handleProfileClick(e, post.userId, post.id)}
                          sx={{ cursor: "pointer" }}
                        />
                      }
                      title={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {post.username}
                        </Typography>
                      }
                      subheader={
                        post.createdAt
                          ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                          : ""
                      }
                    />

                    <CardContent sx={{ pt: 0 }}>
                      <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600, mb: 2 }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
                        {post.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 300px)",
                          gap: 0,
                          justifyContent: "start",
                        }}
                      >
                        {post.imageUrls &&
                          post.imageUrls.map((url, index) => (
                            <Box
                              key={`image-${index}`}
                              component="img"
                              src={url}
                              alt={`Post Image ${index + 1}`}
                              sx={{ width: 300, height: 300, objectFit: "cover", borderRadius: 0 }}
                            />
                          ))}
                        {post.videoUrl && (
                          <Box
                            key="video"
                            component="video"
                            src={post.videoUrl}
                            controls
                            sx={{ width: 300, height: 300, objectFit: "cover", borderRadius: 0 }}
                          />
                        )}
                      </Box>
                    </CardContent>

                    <PostInteractions postId={post.id} />
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid container direction="column" alignItems="center" sx={{ mt: 8 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No posts available yet.
                </Typography>
                <TextField
                  placeholder="What's on your mind?"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    sx: {
                      borderRadius: 5,
                      backgroundColor: "#f0f2f5",
                      "&:hover": {
                        backgroundColor: "#e8ecef",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      fontSize: "1rem",
                      fontWeight: 400,
                      color: "#65676b",
                      cursor: "pointer",
                      py: 1.2,
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    },
                    maxWidth: 430,
                  }}
                  onClick={() => navigate("/createpost")}
                />
              </Grid>
            )}
          </Grid>

          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            
            <MenuItem onClick={handleNavigateMessage}>Message</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage