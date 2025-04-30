<<<<<<< Updated upstream
const Home = () => <h1>Welcome to the Home Page!</h1>;

export default Home;
=======
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Grid,
  Typography,
  Button,
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
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { formatDistanceToNow } from "date-fns"
import PostInteractions from "../components/PostInteractions" // Import the new component

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

  const handleNavigateCreate = () => {
    navigate("/createpost")
  }

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

  // Updated to use direct navigation to message page
  const handleNavigateMessage = () => {
    if (!selectedPostId || !selectedPostId.userId) {
      console.error("No user selected")
      return
    }

    // Navigate directly to the message page with the user ID
    navigate(`/message/${selectedPostId.userId}`)
    handleCloseMenu()
  }

  const handleNavigateLearningPlanForm = () => {
    navigate("/learning/learning-plan")
  }

  const handleNavigationMyLearningPlans = () => {
    navigate("/mylearningplans")
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to the Home Page!
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" sx={{ mr: 2 }} onClick={handleNavigateCreate}>
            Create Post
          </Button>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/profile")}>
            Profile
          </Button>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/myposts")}>
            My Posts
          </Button>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={handleNavigateLearningPlanForm}>
            Create Learning Plan
          </Button>
          <Button variant="outlined" onClick={handleNavigationMyLearningPlans}>
            My Learning Plans
          </Button>
        </Box>
        <Typography variant="h4">All Posts</Typography>
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
                  width: 430,
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
                      {post.userId}
                    </Typography>
                  }
                  subheader={post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ""}
                />

                <CardContent sx={{ pt: 0 }}>
                  <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600, mb: 2 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
                    {post.description}
                  <Divider sx={{ my: 2 }} /> 
                  </Typography>

                  <Box
                    sx={{ display: "grid", gridTemplateColumns: "repeat(2, 200px)", gap: 0, justifyContent: "start" }}
                  >
                    {post.imageUrls &&
                      post.imageUrls.map((url, index) => (
                        <Box
                          key={`image-${index}`}
                          component="img"
                          src={url}
                          alt={`Post Image ${index + 1}`}
                          sx={{ width: 200, height: 200, objectFit: "cover", borderRadius: 0 }}
                        />
                      ))}
                    {post.videoUrl && (
                      <Box
                        key="video"
                        component="video"
                        src={post.videoUrl}
                        controls
                        sx={{ width: 200, height: 200, objectFit: "cover", borderRadius: 0 }}
                      />
                    )}
                  </Box>
                </CardContent>

                {/* PostInteractions component here */}
                <PostInteractions postId={post.id} />
              </Card>
            </Grid>
          ))
        ) : (
          <Grid container direction="column" alignItems="center" sx={{ mt: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No posts available yet.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleNavigateCreate}>
              Create Your First Post
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Menu for Profile Click */}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={handleNavigateProfile}>View Profile</MenuItem>
        <MenuItem onClick={handleNavigateMessage}>Message</MenuItem>
      </Menu>
    </Box>
  )
}

export default HomePage

>>>>>>> Stashed changes
