// src/components/SigninForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      navigate('/'); // navigate to home on successful login
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Sign In
        </Typography>

        {error && <Typography color="error" variant="body2">{error}</Typography>}

        <form onSubmit={handleSignin} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 2 }}
            color="primary"
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SigninForm;