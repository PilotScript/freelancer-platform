import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Avatar,
  Tabs,
  Tab,
  Divider,
  Rating,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock user data
  const user = {
    id: id || '1',
    name: 'Alex Johnson',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    hourlyRate: '$65/hr',
    rating: 4.9,
    totalReviews: 47,
    jobSuccess: 98,
    verified: true,
    about: 'Experienced full stack developer with over 8 years of experience building web applications using React, Node.js, and various databases. I specialize in creating responsive, user-friendly interfaces and robust backend systems.',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'Redux', 'GraphQL', 'AWS', 'Docker'],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Master of Computer Science',
        year: '2015-2017'
      },
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        year: '2011-2015'
      }
    ],
    experience: [
      {
        company: 'TechCorp',
        position: 'Senior Full Stack Developer',
        period: '2019 - Present',
        description: 'Lead developer for multiple web applications, managing both frontend and backend development.'
      },
      {
        company: 'WebSolutions',
        position: 'Frontend Developer',
        period: '2017 - 2019',
        description: 'Developed responsive user interfaces using React and implemented state management with Redux.'
      }
    ],
    portfolio: [
      {
        title: 'E-commerce Platform',
        description: 'A full-featured e-commerce platform with product management, cart functionality, and payment processing.',
        image: 'https://source.unsplash.com/random/300x200/?ecommerce'
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates and team collaboration features.',
        image: 'https://source.unsplash.com/random/300x200/?app'
      },
      {
        title: 'Social Media Dashboard',
        description: 'An analytics dashboard for tracking social media performance across multiple platforms.',
        image: 'https://source.unsplash.com/random/300x200/?dashboard'
      }
    ],
    reviews: [
      {
        id: 1,
        client: 'Sarah Williams',
        rating: 5,
        date: 'March 15, 2025',
        comment: 'Alex was fantastic to work with! He delivered the project ahead of schedule and the code quality was excellent. Would definitely hire again.'
      },
      {
        id: 2,
        client: 'Michael Chen',
        rating: 5,
        date: 'February 28, 2025',
        comment: 'Great communication and technical skills. Alex understood our requirements perfectly and implemented everything we needed.'
      },
      {
        id: 3,
        client: 'Jessica Taylor',
        rating: 4,
        date: 'January 10, 2025',
        comment: 'Very professional and knowledgeable. The project was completed on time and with high quality.'
      }
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                src={`https://source.unsplash.com/random/150x150/?portrait,${user.id}`} 
                alt={user.name}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={user.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {user.rating} ({user.totalReviews} reviews)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StarIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {user.jobSuccess}% Job Success
                </Typography>
              </Box>
              {user.verified && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VerifiedIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    Verified Freelancer
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={9}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {user.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {user.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.hourlyRate}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" color="primary">
                  Contact Me
                </Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {user.about}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.skills.map(skill => (
                  <Chip key={skill} label={skill} size="small" />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Portfolio" />
            <Tab label="Experience" />
            <Tab label="Education" />
            <Tab label="Reviews" />
          </Tabs>
        </Box>
        
        {/* Portfolio Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {user.portfolio.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        {/* Experience Tab */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {user.experience.map((exp, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">{exp.position}</Typography>
                        <Typography variant="body2" color="text.secondary">{exp.period}</Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="subtitle1" color="text.primary">
                          {exp.company}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {exp.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < user.experience.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
        
        {/* Education Tab */}
        <TabPanel value={tabValue} index={2}>
          <List>
            {user.education.map((edu, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">{edu.degree}</Typography>
                        <Typography variant="body2" color="text.secondary">{edu.year}</Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="subtitle1" color="text.primary">
                        {edu.institution}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < user.education.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
        
        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={3}>
          <List>
            {user.reviews.map((review, index) => (
              <React.Fragment key={review.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{review.client}</Typography>
                        <Typography variant="body2" color="text.secondary">{review.date}</Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Box sx={{ my: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" paragraph>
                          {review.comment}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < user.reviews.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ProfilePage;
