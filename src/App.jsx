import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Signup from './pages/SignUp';
import Signin from './pages/SigninPage';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import LearningPlanForm from './components/learning/LearningPlanForm';
import ProgressTracker from './components/learning/ProgressTracker';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost';
import Dashboard from './components/learning/Dashboard';
import MessagePage from './pages/MessagePage';
import MyLearningPlans from './pages/MyLearningPlans';
import ChatListPage from "./pages/ChatListPage";
import NotificationPage from "./pages/NotificationPage";
import EditProfile from './pages/edit-profile';

import './App.css';
import axios from 'axios';
axios.defaults.withCredentials = true;

// Create a custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Red
    },
    background: {
      default: '#f4f6f8', // Light gray background
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/learning/learning-plan" element={<LearningPlanForm />} />
        <Route path="/learning/progress-tracker" element={<ProgressTracker />} />
        <Route path="/learning/dashboard" element={<Dashboard />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/update-post/:postId" element={<EditPost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mylearningplans" element={<MyLearningPlans />} />
        <Route path="/message/:userId" element={<MessagePage />} />
        <Route path="/chat/:userId" element={<ChatListPage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;