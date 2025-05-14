import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid, 
  Chip,
  CircularProgress,
  Container,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { format } from 'date-fns';
import NavBar from '../components/Navbar'; // Adjust the path as needed
import SideMenu from '../components/SideMenu'; // Adjust the path as needed

function MyLearningPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit modal state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/learning-plans');
      setPlans(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching learning plans:', err);
      setError('Failed to load your learning plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`http://localhost:8080/api/learning-plans/${planId}`);
        setPlans(plans.filter(plan => plan.id !== planId));
      } catch (err) {
        console.error('Error deleting learning plan:', err);
        alert('Failed to delete the learning plan. Please try again.');
      }
    }
  };

  const handleOpenEditDialog = (plan) => {
    setEditingPlan(plan);
    setEditFormData({
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate,
      endDate: plan.endDate
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingPlan(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingPlan) return;
    
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append('title', editFormData.title);
      formData.append('description', editFormData.description);
      formData.append('startDate', editFormData.startDate);
      formData.append('endDate', editFormData.endDate);
      
      const response = await axios.put(
        `http://localhost:8080/api/learning-plans/${editingPlan.id}`,
        formData
      );
      
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id ? response.data : plan
      ));
      handleCloseEditDialog();
    } catch (err) {
      console.error('Error updating learning plan:', err);
      alert('Failed to update the learning plan. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getPlanStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { label: 'Upcoming', color: 'info' };
    if (now > end) return { label: 'Completed', color: 'success' };
    return { label: 'Active', color: 'warning' };
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const formatDateForInput = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Navigation Bar */}
      <NavBar />

      {/* SideMenu */}
      <Box
        sx={{
          width: '250px',
          height: '100vh',
          position: 'fixed',
          top: '56px',
          left: 0,
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          zIndex: 1000,
          '@media (max-width: 960px)': {
            width: '200px',
          },
          '@media (max-width: 600px)': {
            width: '60px',
          },
        }}
      >
        <SideMenu />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          marginLeft: '250px',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#f5f7fa',
          '@media (max-width: 960px)': {
            marginLeft: '200px',
          },
          '@media (max-width: 600px)': {
            marginLeft: '60px',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 2, backgroundColor: '#ffffff' }}>
            <Typography variant="h3" gutterBottom align="center" color="#1a3c57" fontWeight="bold">
              My Learning Plans
            </Typography>
            <Divider sx={{ mb: 4, borderColor: '#1a3c57' }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#1a3c57' }} />
              </Box>
            ) : error ? (
              <Typography color="error" align="center" sx={{ p: 4 }}>
                {error}
              </Typography>
            ) : plans.length === 0 ? (
              <Typography align="center" sx={{ p: 4, color: '#666' }}>
                You don't have any learning plans yet. Create your first one!
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {plans.map((plan) => {
                  const status = getPlanStatus(plan.startDate, plan.endDate);
                  
                  return (
                    <Grid item xs={12} md={6} lg={4} key={plan.id}>
                      <Card 
                        elevation={4}
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 8,
                          },
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h5" component="h2" color="#1a3c57" noWrap>
                              {plan.title}
                            </Typography>
                            <Chip 
                              label={status.label} 
                              color={status.color} 
                              size="small" 
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Box>
                          
                          <Typography 
                            variant="body1" 
                            color="#666"
                            sx={{ 
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              height: '4.5em',
                            }}
                          >
                            {plan.description}
                          </Typography>
                          
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="#666">
                              <strong style={{ color: '#1a3c57' }}>Start:</strong> {formatDate(plan.startDate)}
                            </Typography>
                            <Typography variant="body2" color="#666">
                              <strong style={{ color: '#1a3c57' }}>End:</strong> {formatDate(plan.endDate)}
                            </Typography>
                          </Box>
                        </CardContent>
                        
                        <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                          <Button 
                            size="small" 
                            variant="contained"
                            onClick={() => handleOpenEditDialog(plan)}
                            sx={{ 
                              backgroundColor: '#1a3c57',
                              '&:hover': { backgroundColor: '#153e63' },
                              textTransform: 'none',
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleDelete(plan.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              href="/learning/learning-plan"
              size="large"
              sx={{ 
                backgroundColor: '#1a3c57',
                '&:hover': { backgroundColor: '#153e63' },
                padding: '10px 20px',
                fontSize: '16px',
              }}
            >
              Create New Learning Plan
            </Button>
          </Box>

          {/* Edit Plan Dialog */}
          <Dialog 
            open={editDialogOpen} 
            onClose={handleCloseEditDialog}
            fullWidth
            maxWidth="sm"
            PaperProps={{ elevation: 6, sx: { borderRadius: 2 } }}
          >
            <DialogTitle sx={{ backgroundColor: '#1a3c57', color: '#ffffff', p: 2 }}>
              Edit Learning Plan
            </DialogTitle>
            <form onSubmit={handleEditSubmit}>
              <DialogContent sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  variant="outlined"
                  margin="normal"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  required
                  InputLabelProps={{ style: { color: '#1a3c57' } }}
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  required
                  InputLabelProps={{ style: { color: '#1a3c57' } }}
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true, style: { color: '#1a3c57' } }}
                  value={formatDateForInput(editFormData.startDate)}
                  onChange={handleEditFormChange}
                  required
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true, style: { color: '#1a3c57' } }}
                  value={formatDateForInput(editFormData.endDate)}
                  onChange={handleEditFormChange}
                  required
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2, backgroundColor: '#f5f7fa' }}>
                <Button onClick={handleCloseEditDialog} disabled={updating} sx={{ textTransform: 'none', color: '#666' }}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={updating}
                  sx={{ 
                    backgroundColor: '#1a3c57',
                    '&:hover': { backgroundColor: '#153e63' },
                    textTransform: 'none',
                  }}
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}

export default MyLearningPlans;