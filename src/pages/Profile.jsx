import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, Avatar, Typography, Divider, Button } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/user-info', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : 'Invalid Date';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
        padding: '20px',
      }}
    >
      {user ? (
        <Card
          sx={{
            boxShadow: 2,
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#fff',
            textAlign: 'center',
          }}
        >
          <Avatar
            src={user.picture}
            alt={user.name}
            sx={{
              width: '120px',
              height: '120px',
              marginBottom: '20px',
              borderRadius: '50%',
              border: '5px solid #00796b',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
            referrerPolicy="no-referrer"
          />
          <Typography variant="h5" sx={{ fontWeight: '500', marginBottom: '10px' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '15px' }}>
            {user.email}
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          
          <Button
            variant="contained"
            color="success"
            sx={{
              padding: '10px 25px',
              borderRadius: '20px',
              fontWeight: 'bold',
              textTransform: 'capitalize',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => alert('Edit profile functionality coming soon!')}
          >
            Edit Profile
          </Button>
        </Card>
      ) : (
        <Typography variant="h6">Loading user data...</Typography>
      )}
    </Box>
  );
};

export default Profile;
 