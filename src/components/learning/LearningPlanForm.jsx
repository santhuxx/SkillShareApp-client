// src/components/LearningPlanForm.js
import React, { useState } from 'react';
import axios from 'axios';

function LearningPlanForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div>
      <h2>Create Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Create Plan</button>
      </form>
    </div>
  );
}

export default LearningPlanForm;
