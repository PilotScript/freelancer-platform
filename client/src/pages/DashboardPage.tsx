import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Tabs,
  Tab,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Avatar,
  useTheme
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock dashboard data
  const dashboardData = {
    stats: {
      activeProposals: 5,
      activeJobs: 2,
      completedJobs: 12,
      totalEarnings: 3450,
    },
    recentProposals: [
      {
        id: 1,
        jobTitle: 'React Developer for E-commerce Website',
        client: 'TechSolutions Inc.',
        date: 'Mar 28, 2025',
        status: 'pending',
        amount: '$1,200'
      },
      {
        id: 2,
        jobTitle: 'Frontend UI Implementation',
        client: 'DesignStudio',
        date: 'Mar 25, 2025',
        status: 'accepted',
        amount: '$800'
      },
      {
        id: 3,
        jobTitle: 'Mobile App Development',
        client: 'AppWorks',
        date: 'Mar 20, 2025',
        status: 'rejected',
        amount: '$2,500'
      }
    ],
    activeJobs: [
      {
        id: 1,
        title: 'Frontend UI Implementation',
        client: 'DesignStudio',
        deadline: 'Apr 15, 2025',
        progress: 60,
        amount: '$800'
      },
      {
        id: 2,
        title: 'API Integration for Web Application',
        client: 'DataSystems',
        deadline: 'Apr 10, 2025',
        progress: 25,
        amount: '$1,200'
      }
    ],
    recentMessages: [
      {
        id: 1,
        sender: 'Sarah Williams',
        avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman',
        message: 'Hi, I wanted to discuss the project timeline.',
        time: '10:30 AM'
      },
      {
        id: 2,
        sender: 'Michael Chen',
        avatar: 'https://source.unsplash.com/random/100x100/?portrait,man',
        message: 'The design looks great! Can we schedule a call?',
        time: 'Yesterday'
      }
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Active Proposals
                </Typography>
              </Box>
              <Typography variant="h3" component="div" color="primary.main">
                {dashboardData.stats.activeProposals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Active Jobs
                </Typography>
              </Box>
              <Typography variant="h3" component="div" color="primary.main">
                {dashboardData.stats.activeJobs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Completed Jobs
                </Typography>
              </Box>
              <Typography variant="h3" component="div" color="primary.main">
                {dashboardData.stats.completedJobs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaymentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Earnings
                </Typography>
              </Box>
              <Typography variant="h3" component="div" color="primary.main">
                ${dashboardData.stats.totalEarnings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Dashboard Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="Overview" />
            <Tab label="Proposals" />
            <Tab label="Active Jobs" />
            <Tab label="Messages" />
          </Tabs>
        </Box>
        
        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Jobs
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {dashboardData.activeJobs.map((job) => (
                    <Box key={job.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" component={Link} to={`/jobs/${job.id}`} sx={{ textDecoration: 'none', color: 'primary.main' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {job.amount}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Client: {job.client}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Deadline: {job.deadline}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress variant="determinate" value={job.progress} />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {job.progress}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/jobs"
                    sx={{ mt: 2 }}
                  >
                    Find More Jobs
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Messages
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {dashboardData.recentMessages.map((message) => (
                      <ListItem 
                        key={message.id}
                        button
                        component={Link}
                        to="/messages"
                        sx={{ px: 0 }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar src={message.avatar} alt={message.sender} sx={{ width: 32, height: 32 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={message.sender}
                          secondary={
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              noWrap
                              sx={{ maxWidth: '200px' }}
                            >
                              {message.message}
                            </Typography>
                          }
                        />
                        <Typography variant="caption" color="text.secondary">
                          {message.time}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/messages"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    View All Messages
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Completion
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={75} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        75%
                      </Typography>
                    </Box>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Basic Information" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Skills" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PendingIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="Portfolio Samples" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PendingIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="Certifications" />
                    </ListItem>
                  </List>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/profile"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Proposals Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Proposals
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {dashboardData.recentProposals.map((proposal) => (
                  <ListItem 
                    key={proposal.id}
                    sx={{ 
                      px: 0, 
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 2
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="subtitle1" 
                          component={Link} 
                          to={`/proposals/${proposal.id}`}
                          sx={{ textDecoration: 'none', color: 'primary.main' }}
                        >
                          {proposal.jobTitle}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Client: {proposal.client}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Submitted: {proposal.date}
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {proposal.amount}
                      </Typography>
                      <Chip 
                        label={proposal.status} 
                        size="small"
                        color={
                          proposal.status === 'accepted' ? 'success' : 
                          proposal.status === 'rejected' ? 'error' : 
                          'default'
                        }
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Button 
                variant="contained" 
                component={Link} 
                to="/jobs"
                sx={{ mt: 2 }}
              >
                Find More Jobs
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
        
        {/* Active Jobs Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Jobs
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {dashboardData.activeJobs.length > 0 ? (
                dashboardData.activeJobs.map((job) => (
                  <Box key={job.id} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component={Link} to={`/jobs/${job.id}`} sx={{ textDecoration: 'none', color: 'primary.main' }}>
                 
(Content truncated due to size limit. Use line ranges to read in chunks)