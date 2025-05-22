import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from 'context/ThemeContext';

import Navbar from 'components/Navbar/Navbar';
import Settings from 'components/Settings';
import Dashboard from 'components/Dashboard/Dashboard';
import Profile from 'components/Profile/Profile';
import Home from 'components/Home/Home';
import Tasks from 'components/Tasks/Tasks';
import TaskDetail from 'components/Tasks/TaskDetail';

function App() {
  return (
    <ThemeProvider>
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
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
