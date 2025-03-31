import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider, 
  ListItemIcon, 
  useTheme,
  useMediaQuery,
  Badge,
  InputBase,
  alpha,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink } from 'react-router-dom';

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);
  const [messagesAnchorEl, setMessagesAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const messagesOpen = Boolean(messagesAnchorEl);
  
  // Mock authentication state (in a real app, this would come from a context or Redux)
  const isAuthenticated = true;
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleMessagesClick = (event: React.MouseEvent<HTMLElement>) => {
    setMessagesAnchorEl(event.currentTarget);
  };
  
  const handleMessagesClose = () => {
    setMessagesAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}
        >
          FreelancerHub
        </Typography>
        
        {!isSmall && (
          <Search sx={{ display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search jobs or freelancers…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            onClick={toggleDarkMode}
            sx={{ ml: 1 }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/jobs"
                    sx={{ mx: 1 }}
                  >
                    Find Jobs
                  </Button>
                  
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/dashboard"
                    sx={{ mx: 1 }}
                  >
                    Dashboard
                  </Button>
                </>
              )}
              
              <Tooltip title="Messages">
                <IconButton
                  color="inherit"
                  onClick={handleMessagesClick}
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={3} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={messagesAnchorEl}
                open={messagesOpen}
                onClose={handleMessagesClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={RouterLink} to="/messages">
                  <Avatar src="https://source.unsplash.com/random/100x100/?portrait,woman" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Sarah Williams</Typography>
                    <Typography variant="caption" color="text.secondary">Hi, I wanted to discuss the project...</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem component={RouterLink} to="/messages">
                  <Avatar src="https://source.unsplash.com/random/100x100/?portrait,man" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Michael Chen</Typography>
                    <Typography variant="caption" color="text.secondary">The design looks great! Can we...</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem component={RouterLink} to="/messages">
                  <Avatar src="https://source.unsplash.com/random/100x100/?portrait,woman" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Jessica Parker</Typography>
                    <Typography variant="caption" color="text.secondary">I've reviewed your proposal...</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem component={RouterLink} to="/messages" sx={{ justifyContent: 'center' }}>
                  <Typography variant="body2" color="primary">View All Messages</Typography>
                </MenuItem>
              </Menu>
              
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotificationsClick}
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={5} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={notificationsAnchorEl}
                open={notificationsOpen}
                onClose={handleNotificationsClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <WorkIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">New job matching your skills</Typography>
                    <Typography variant="caption" color="text.secondary">React Developer for E-commerce Website</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">Your proposal was viewed</Typography>
                    <Typography variant="caption" color="text.secondary">TechSolutions Inc. viewed your proposal</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <MailIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">New message received</Typography>
                    <Typography variant="caption" color="text.secondary">Jessica Parker sent you a message</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem sx={{ justifyContent: 'center' }}>
                  <Typography variant="body2" color="primary">View All Notifications</Typography>
                </MenuItem>
              </Menu>
              
              <Tooltip title="Account">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink} 
                to="/register"
                sx={{ ml: 1 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={RouterLink} to="/profile/me">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={RouterLink} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <Divider />
        <MenuItem component={RouterLink} to="/settings">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem component={RouterLink} to="/logout">
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {isSmall && (
        <Box sx={{ width: '100%', p: 2, display: { xs: 'block', sm: 'none' } }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search jobs or freelancers…"
              inputProps={{ 'aria-label': 'search' }}
              fullWidth
            />
          </Search>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
