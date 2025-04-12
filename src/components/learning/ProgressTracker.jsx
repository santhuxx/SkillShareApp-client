// src/components/ProgressTracker.js
import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Update Progress</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Milestone"
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Update Progress</button>
      </form>
    </div>
  );
}

export default ProgressTracker;
