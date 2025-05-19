import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from 'context/ThemeContext';

import Navbar from 'components/Navbar';
import Settings from 'components/Settings';
import Dashboard from 'components/Dashboard/Dashboard';
import Profile from 'components/Profile/Profile';

import 'src/App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className='app-container'>
          <Navbar />
          <main className='main-content'>
            <Routes>
              <Route path='/' element={<h1>Master Management</h1>} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
