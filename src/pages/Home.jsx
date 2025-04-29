import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/createpost');
  };

  return (
    <div>
      Welcome to the Home Page!
      <button onClick={handleNavigate}>Go to Create Post</button>
      <button onClick={() => navigate('/profile')}>Profile</button>
      <button onClick={() => navigate('/myposts')}>My Posts</button>
    </div>
  )
}

export default Home
