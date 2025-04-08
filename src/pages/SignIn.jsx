import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/signin', user);
      
      // Check if response contains a token (or other success indicator)
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      // Server responded with an error (401, 403 etc.)
      setError('Invalid email or password');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;