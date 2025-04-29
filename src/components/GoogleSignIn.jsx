import React from "react";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button
        variant="outlined"
        startIcon={<FcGoogle size={24} />}
        onClick={handleGoogleSignIn}
        sx={{
          padding: '10px 20px',
          borderRadius: '0px',
          textTransform: 'none',
          fontSize: '16px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        Sign in with Google
      </Button>
    </div>
  );
};

export default GoogleSignIn;
