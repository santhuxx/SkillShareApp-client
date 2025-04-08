import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import SigninForm from '../components/SignInForm'; // Adjust the import path as necessary
import GoogleSignIn from '../components/GoogleSignIn'; // Import Google Sign-In component

const SigninPage = () => {
  return (
    <>
      <CssBaseline />
      {/* Background image and color */}
      <Box
        sx={{
          position: 'fixed', // This ensures it stays fixed as the background
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("src/assets/Skillshare.jpg")', // Path to your image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1, // Keeps the background behind the content
          filter: 'blur(8px)', // Optional: applies blur effect on the background
        }}
      />

      {/* Form container */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          <SigninForm />
          <div style={{ marginTop: '20px' }}>
            {/* Google Sign-In Button */}
            <GoogleSignIn />
          </div>
        </Box>
      </Box>
    </>
  );
};

export default SigninPage;