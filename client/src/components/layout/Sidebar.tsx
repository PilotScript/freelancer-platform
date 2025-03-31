import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography, 
  useTheme,
  Collapse,
  ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Drawer width
const drawerWidth = 240;

// Styled drawer component for permanent drawer
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: "permanent" | "persistent" | "temporary";
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
  const theme = useTheme();
  const location = useLocation();
  const [jobsOpen, setJobsOpen] = React.useState(false);
  
  // Toggle jobs submenu
  const handleJobsClick = () => {
    setJobsOpen(!jobsOpen);
  };
  
  // Check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Sidebar content
  const sidebarContent = (
    <>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          FreelancerHub
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find work, hire talent
        </Typography>
      </Box>
      
      <List component="nav" sx={{ p: 1 }}>
        <ListItem 
          button 
          component={RouterLink} 
          to="/"
          selected={isActive('/')}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isActive('/') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <HomeIcon color={isActive('/') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        
        <ListItemButton 
          onClick={handleJobsClick}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: location.pathname.includes('/jobs') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <WorkIcon color={location.pathname.includes('/jobs') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Jobs" />
          {jobsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        
        <Collapse in={jobsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={RouterLink} 
              to="/jobs"
              selected={isActive('/jobs')}
              sx={{ 
                pl: 4,
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: isActive('/jobs') ? 
                  (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                  'transparent'
              }}
            >
              <ListItemIcon>
                <SearchIcon color={isActive('/jobs') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Find Jobs" />
            </ListItem>
            
            <ListItem 
              button 
              component={RouterLink} 
              to="/jobs/saved"
              selected={isActive('/jobs/saved')}
              sx={{ 
                pl: 4,
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: isActive('/jobs/saved') ? 
                  (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                  'transparent'
              }}
            >
              <ListItemIcon>
                <StarIcon color={isActive('/jobs/saved') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Saved Jobs" />
            </ListItem>
            
            <ListItem 
              button 
              component={RouterLink} 
              to="/jobs/proposals"
              selected={isActive('/jobs/proposals')}
              sx={{ 
                pl: 4,
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: isActive('/jobs/proposals') ? 
                  (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                  'transparent'
              }}
            >
              <ListItemIcon>
                <WorkHistoryIcon color={isActive('/jobs/proposals') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="My Proposals" />
            </ListItem>
            
            <ListItem 
              button 
              component={RouterLink} 
              to="/jobs/post"
              selected={isActive('/jobs/post')}
              sx={{ 
                pl: 4,
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: isActive('/jobs/post') ? 
                  (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                  'transparent'
              }}
            >
              <ListItemIcon>
                <AddIcon color={isActive('/jobs/post') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Post a Job" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/dashboard"
          selected={isActive('/dashboard')}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isActive('/dashboard') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <DashboardIcon color={isActive('/dashboard') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/messages"
          selected={isActive('/messages')}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isActive('/messages') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <MailIcon color={isActive('/messages') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItem>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/profile/me"
          selected={isActive('/profile/me')}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isActive('/profile/me') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <PersonIcon color={isActive('/profile/me') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/payment"
          selected={isActive('/payment')}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isActive('/payment') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <PaymentIcon color={isActive('/payment') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Payments" />
        </ListItem>
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <List component="nav" sx={{ p: 1 }}>
        <ListItem 
          button 
          component={RouterLink} 
          to="/settings"
          selected={isActive('/settings')}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isActive('/settings') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <SettingsIcon color={isActive('/settings') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/help"
          selected={isActive('/help')}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: isActive('/help') ? 
              (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
              'transparent'
          }}
        >
          <ListItemIcon>
            <HelpIcon color={isActive('/help') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItem>
      </List>
    </>
  );
  
  // Render different drawer variants based on props
  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }
  
  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%'
        },
      }}
    >
      {sidebarContent}
    </StyledDrawer>
  );
};

export default Sidebar;

// Missing import
import SearchIcon from '@mui/icons-material/Search';
