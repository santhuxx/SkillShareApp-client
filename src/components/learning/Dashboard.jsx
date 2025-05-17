import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';

function Dashboard() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/learning-plans');
        setLearningPlans(response.data);
      } catch (error) {
        console.error('Error fetching learning plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlans();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Learning Plans
      </Typography>
      <Grid container spacing={3}>
        {learningPlans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {plan.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Start Date:</strong> {plan.startDate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>End Date:</strong> {plan.endDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;