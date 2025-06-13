import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { ThemeProvider } from 'context/ThemeContext';

import Navbar from 'components/Navbar/Navbar';
import Settings from 'components/Settings';
import Dashboard from 'components/Dashboard/Dashboard';
import Profile from 'components/Profile/Profile';
import Home from 'components/Home/Home';
import Tasks from 'components/Tasks/Tasks';
import TaskDetail from 'components/Tasks/TaskDetail';
import Login from 'components/auth/login';
import Signup from 'components/auth/Signup';

function App() {
  return (
    <ThemeProvider>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <Router>
        <div className='app-container'>
          <Navbar />
          <main className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/tasks' element={<Tasks />} />
              <Route path='/tasks/:id' element={<TaskDetail />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
