import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  useMediaQuery 
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme, responsiveDarkTheme } from './styles/responsiveTheme';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';
import DashboardPage from './pages/DashboardPage';
import SubmitProposalPage from './pages/SubmitProposalPage';
import PaymentPage from './pages/PaymentPage';
import StripePaymentPage from './pages/StripePaymentPage';

// Import responsive styles
import './styles/responsive.css';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  
  // Check user's preferred color scheme
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDarkMode);
    }
  }, []);
  
  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <ThemeProvider theme={darkMode ? responsiveDarkTheme : theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflow: 'hidden'
        }}>
          <Navbar 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            toggleSidebar={toggleSidebar}
          />
          
          <Box sx={{ 
            display: 'flex', 
            flex: 1,
            position: 'relative'
          }}>
            <Sidebar 
              open={sidebarOpen} 
              onClose={() => setSidebarOpen(false)}
              variant={isMobile ? "temporary" : "permanent"}
            />
            
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1,
                width: { xs: '100%', md: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
                ml: { xs: 0, md: sidebarOpen ? '240px' : 0 },
                transition: theme => theme.transitions.create(['margin', 'width'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                pt: { xs: 2, sm: 3 },
                pb: { xs: 8, sm: 6 }
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/jobs/:jobId/proposal" element={<SubmitProposalPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/payment/stripe/:jobId" element={<StripePaymentPage />} />
              </Routes>
            </Box>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
