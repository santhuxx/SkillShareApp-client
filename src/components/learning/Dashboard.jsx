// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [learningPlans, setLearningPlans] = useState([]);

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/learning-plans');
        setLearningPlans(response.data);
      } catch (error) {
        console.error('Error fetching learning plans:', error);
      }
    };

    fetchLearningPlans();
  }, []);

  return (
    <div>
      <h2>My Learning Plans</h2>
      {learningPlans.map((plan) => (
        <div key={plan.id}>
          <h3>{plan.title}</h3>
          <p>{plan.description}</p>
          <p>Start Date: {plan.startDate}</p>
          <p>End Date: {plan.endDate}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
