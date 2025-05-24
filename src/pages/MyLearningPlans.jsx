import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, CardActions, Button, Grid, Chip,
  CircularProgress, Container, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField
} from '@mui/material';
import { format } from 'date-fns';
import NavBar from '../components/Navbar';
import SideMenu from '../components/SideMenu';

function MyLearningPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/learning-plans', {
        withCredentials: true,
      });
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
        await axios.delete(`http://localhost:8080/api/learning-plans/${planId}`, {
          withCredentials: true,
        });
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
        formData,
        { withCredentials: true }
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
      return dateString || 'N/A';
    }
  };

  const formatDateForInput = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return dateString || '';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#121212' }}>
      {/* Side Menu */}
      <SideMenu />

      {/* Main Content */}
      <Box sx={{ flex: 1, ml: '240px' }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 6, mt: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center" 
            sx={{ color: '#ffffff', fontWeight: 600, mb: 4 }}
          >
            My Learning Plans
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#ffffff' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ bgcolor: '#2c2c2c', color: '#ffffff', m: 4 }}>
              {error}
            </Alert>
          ) : plans.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography sx={{ color: '#b0b0b0', mb: 3 }}>
                You don't have any learning plans yet. Create your first one!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/learning/learning-plan')}
                sx={{
                  bgcolor: '#0288d1',
                  color: '#ffffff',
                  '&:hover': { bgcolor: '#039be5' },
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                }}
              >
                Create New Learning Plan
              </Button>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {plans.map((plan) => {
                const status = getPlanStatus(plan.startDate, plan.endDate);
                const chipColors = {
                  info: { bgcolor: '#0288d1', color: '#ffffff' },
                  success: { bgcolor: '#2e7d32', color: '#ffffff' },
                  warning: { bgcolor: '#f57c00', color: '#ffffff' },
                };
                return (
                  <Grid item xs={12} md={6} lg={4} key={plan.id}>
                    <Card 
                      sx={{ 
                        bgcolor: '#1e1e1e',
                        borderRadius: 2,
                        border: '1px solid #333333',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ color: '#ffffff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {plan.title}
                          </Typography>
                          <Chip 
                            label={status.label} 
                            sx={{ 
                              ...chipColors[status.color], 
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ color: '#b0b0b0', mb: 2, lineHeight: 1.6 }}
                        >
                          {plan.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          <strong style={{ color: '#e0e0e0' }}>Start:</strong> {formatDate(plan.startDate)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          <strong style={{ color: '#e0e0e0' }}>End:</strong> {formatDate(plan.endDate)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                        <Button 
                          size="small" 
                          variant="contained"
                          onClick={() => handleOpenEditDialog(plan)}
                          sx={{ 
                            bgcolor: '#0288d1',
                            color: '#ffffff',
                            '&:hover': { bgcolor: '#039be5' },
                            textTransform: 'none',
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleDelete(plan.id)}
                          sx={{ 
                            borderColor: '#ff5252',
                            color: '#ff5252',
                            '&:hover': { 
                              bgcolor: '#ff525233',
                              borderColor: '#ff5252',
                            },
                            textTransform: 'none',
                          }}
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
          {plans.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/learning/learning-plan')}
                sx={{
                  bgcolor: '#0288d1',
                  color: '#ffffff',
                  '&:hover': { bgcolor: '#039be5' },
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                }}
              >
                Create New Learning Plan
              </Button>
            </Box>
          )}
          <Dialog 
            open={editDialogOpen} 
            onClose={handleCloseEditDialog}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { bgcolor: '#1e1e1e', borderRadius: 2 } }}
          >
            <DialogTitle sx={{ bgcolor: '#1e1e1e', color: '#ffffff', p: 2 }}>
              Edit Learning Plan
            </DialogTitle>
            <form onSubmit={handleEditSubmit}>
              <DialogContent sx={{ p: 3, bgcolor: '#1e1e1e' }}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  variant="outlined"
                  margin="normal"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  required
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ 
                    sx: { 
                      color: '#e0e0e0',
                      bgcolor: '#252525',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1' },
                    }
                  }}
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
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ 
                    sx: { 
                      color: '#e0e0e0',
                      bgcolor: '#252525',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1' },
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true, style: { color: '#b0b0b0' } }}
                  value={formatDateForInput(editFormData.startDate)}
                  onChange={handleEditFormChange}
                  required
                  InputProps={{ 
                    sx: { 
                      color: '#e0e0e0',
                      bgcolor: '#252525',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1' },
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true, style: { color: '#b0b0b0' } }}
                  value={formatDateForInput(editFormData.endDate)}
                  onChange={handleEditFormChange}
                  required
                  InputProps={{ 
                    sx: { 
                      color: '#e0e0e0',
                      bgcolor: '#252525',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333333' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0288d1' },
                    }
                  }}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2, bgcolor: '#1e1e1e' }}>
                <Button 
                  onClick={handleCloseEditDialog} 
                  disabled={updating} 
                  sx={{ color: '#b0b0b0', textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={updating}
                  sx={{ 
                    bgcolor: '#0288d1',
                    color: '#ffffff',
                    '&:hover': { bgcolor: '#039be5' },
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
