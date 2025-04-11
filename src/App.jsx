import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/SignUp';
import Signin from './pages/SigninPage';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LearningPlanForm from './components/learning/LearningPlanForm';
import ProgressTracker from './components/learning/ProgressTracker';
import Dashboard from './components/learning/Dashboard';
import './App.css';


function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/learning/learning-plan" element={<LearningPlanForm />} />
        <Route path="/learning/progress-tracker" element={<ProgressTracker />} />
        <Route path="/learning/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;