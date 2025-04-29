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
        // Remove the deleted plan from state
        setPlans(plans.filter(plan => plan.id !== planId));
      } catch (err) {
        console.error('Error deleting learning plan:', err);
        alert('Failed to delete the learning plan. Please try again.');
      }
    }
  };

  // Open edit dialog and set form data
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

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingPlan(null);
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingPlan) return;
    
    try {
      setUpdating(true);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('title', editFormData.title);
      formData.append('description', editFormData.description);
      formData.append('startDate', editFormData.startDate);
      formData.append('endDate', editFormData.endDate);
      
      // Send update request
      const response = await axios.put(
        `http://localhost:8080/api/learning-plans/${editingPlan.id}`,
        formData
      );
      
      // Update the plans state with the edited plan
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id ? response.data : plan
      ));
      
      // Close the dialog
      handleCloseEditDialog();
      
    } catch (err) {
      console.error('Error updating learning plan:', err);
      alert('Failed to update the learning plan. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Calculate if a plan is active, completed, or upcoming
  const getPlanStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { label: 'Upcoming', color: 'info' };
    if (now > end) return { label: 'Completed', color: 'success' };
    return { label: 'Active', color: 'warning' };
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          My Learning Plans
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : plans.length === 0 ? (
          <Typography align="center" sx={{ p: 4 }}>
            You don't have any learning plans yet. Create your first one!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {plans.map((plan) => {
              const status = getPlanStatus(plan.startDate, plan.endDate);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={plan.id}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" component="h2" noWrap>
                          {plan.title}
                        </Typography>
                        <Chip 
                          label={status.label} 
                          color={status.color} 
                          size="small" 
                        />
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          height: '4.5em'
                        }}
                      >
                        {plan.description}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Start:</strong> {formatDate(plan.startDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>End:</strong> {formatDate(plan.endDate)}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleOpenEditDialog(plan)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        onClick={() => handleDelete(plan.id)}
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
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          href="/learning/learning-plan"
          size="large"
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
      >
        <DialogTitle>Edit Learning Plan</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              name="title"
              variant="outlined"
              margin="normal"
              value={editFormData.title}
              onChange={handleEditFormChange}
              required
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
            />
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formatDateForInput(editFormData.startDate)}
              onChange={handleEditFormChange}
              required
            />
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formatDateForInput(editFormData.endDate)}
              onChange={handleEditFormChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={updating}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default MyLearningPlans;