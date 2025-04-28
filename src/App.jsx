import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Signup from './pages/SignUp';
import Signin from './pages/SigninPage';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LearningPlanForm from './components/learning/LearningPlanForm';
import ProgressTracker from './components/learning/ProgressTracker';
import Dashboard from './components/learning/Dashboard';
import './App.css';

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
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets default browser styles */}
      <Navbar />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learning/learning-plan" element={<LearningPlanForm />} />
          <Route path="/learning/progress-tracker" element={<ProgressTracker />} />
          <Route path="/learning/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;