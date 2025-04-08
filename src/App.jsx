import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/SignUp';
import Signin from './pages/SigninPage';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './App.css';


function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;