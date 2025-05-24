import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Grid, CircularProgress, 
  Alert, Button 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


function Dashboard() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/learning-plans', {
          withCredentials: true,
        });
        setLearningPlans(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch learning plans.');
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
          bgcolor: '#121212',
        }}
      >
        <CircularProgress sx={{ color: '#ffffff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#121212',
        }}
      >
        <Alert severity="error" sx={{ bgcolor: '#2c2c2c', color: '#ffffff' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#121212', minHeight: '100vh' }}>
      {/* Side Menu */}
     

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: '240px' }}>
        <Box sx={{ p: 3, mt: 8 }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: '#ffffff', fontWeight: 600 }}
          >
            My Learning Plans
          </Typography>
          <Grid container spacing={3}>
            {learningPlans.length > 0 ? (
              learningPlans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: '#1e1e1e',
                      borderRadius: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ color: '#ffffff', fontWeight: 500 }}
                      >
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#b0b0b0', mb: 2 }}
                      >
                        {plan.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#b0b0b0' }}
                      >
                        <strong style={{ color: '#e0e0e0' }}>Start Date:</strong> {plan.startDate || 'N/A'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#b0b0b0' }}
                      >
                        <strong style={{ color: '#e0e0e0' }}>End Date:</strong> {plan.endDate || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{ color: '#b0b0b0', mt: 4, mb: 2 }}
                >
                  No learning plans found.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create-learning-plan')}
                  sx={{
                    bgcolor: '#ff5252',
                    color: '#ffffff',
                    '&:hover': { bgcolor: '#e04848' },
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                  }}
                >
                  Create a Learning Plan
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
