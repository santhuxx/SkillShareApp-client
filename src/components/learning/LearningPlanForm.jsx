import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import NavBar from '../Navbar';
import SideMenu from '../SideMenu';

function LearningPlanForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    //  Check if endDate is before startDate
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before the start date.');
      return;
    }

    const newPlan = { title, description, startDate, endDate };

    try {
      await axios.post('http://localhost:8080/api/learning-plans', newPlan);
      alert('Learning Plan Created Successfully!');
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error creating learning plan:', error);
      setError('Failed to create learning plan. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.900', mt: 8 }}>
      <SideMenu />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: '240px' }, transition: 'margin-left 0.3s' }}>
        <NavBar />
        <Box
          sx={{
            maxWidth: 500,
            margin: 'auto',
            padding: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Create Learning Plan
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Create Plan
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default LearningPlanForm;