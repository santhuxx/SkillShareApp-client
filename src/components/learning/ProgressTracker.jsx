import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Select, MenuItem, Button, Typography } from '@mui/material';

function ProgressTracker({ planId }) {
  const [milestone, setMilestone] = useState('');
  const [status, setStatus] = useState('Not Started');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const progressUpdate = { milestone, status };

    try {
      await axios.post(`http://localhost:8080/api/learning-plans/${planId}/progress`, progressUpdate);
      alert('Progress Updated Successfully!');
      setMilestone('');
      setStatus('Not Started');
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Update Progress
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Milestone"
          variant="outlined"
          margin="normal"
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          required
        />
        <Select
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="Not Started">Not Started</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Update Progress
        </Button>
      </form>
    </Box>
  );
}

export default ProgressTracker;