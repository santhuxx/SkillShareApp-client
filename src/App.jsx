import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/SignUp';
import Signin from './pages/SigninPage';
import Home from './pages/Home';
import Profile from './pages/Profile';
<<<<<<< Updated upstream
=======
import LearningPlanForm from './components/learning/LearningPlanForm';
import ProgressTracker from './components/learning/ProgressTracker';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost';
import Dashboard from './components/learning/Dashboard';
import MessagePage from './pages/MessagePage';
import MyLearningPlans from './pages/MyLearningPlans';
import ChatListPage from "./pages/ChatListPage";


>>>>>>> Stashed changes
import './App.css';
import axios from 'axios';
axios.defaults.withCredentials = true;


function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
<<<<<<< Updated upstream
=======
        <Route path="/learning/learning-plan" element={<LearningPlanForm />} />
        <Route path="/learning/progress-tracker" element={<ProgressTracker />} />
        <Route path="/learning/dashboard" element={<Dashboard />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/update-post/:postId" element={<EditPost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mylearningplans" element={<MyLearningPlans />} />
        <Route path="/message/:userId" element={<MessagePage />} />
        <Route path="/chat/:userId" element={<ChatListPage />} />
        <Route path="/chat" element={<ChatListPage />} />
>>>>>>> Stashed changes
      </Routes>
    </>
  );
}

export default App;