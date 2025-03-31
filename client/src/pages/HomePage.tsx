import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';

const HomePage: React.FC = () => {
  const theme = useTheme();

  // Mock featured jobs
  const featuredJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'Remote',
      salary: '$50-70/hr',
      tags: ['React', 'TypeScript', 'Redux'],
      image: 'https://source.unsplash.com/random/300x200/?tech'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'New York',
      salary: '$45-60/hr',
      tags: ['Figma', 'Adobe XD', 'UI Design'],
      image: 'https://source.unsplash.com/random/300x200/?design'
    },
    {
      id: 3,
      title: 'Content Writer',
      company: 'ContentHub',
      location: 'Remote',
      salary: '$30-40/hr',
      tags: ['Copywriting', 'SEO', 'Blog'],
      image: 'https://source.unsplash.com/random/300x200/?writing'
    }
  ];

  // Mock top freelancers
  const topFreelancers = [
    {
      id: 1,
      name: 'Alex Johnson',
      title: 'Full Stack Developer',
      rating: 4.9,
      hourlyRate: '$65/hr',
      image: 'https://source.unsplash.com/random/100x100/?portrait,man'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      title: 'Graphic Designer',
      rating: 4.8,
      hourlyRate: '$55/hr',
      image: 'https://source.unsplash.com/random/100x100/?portrait,woman'
    },
    {
      id: 3,
      name: 'Michael Chen',
      title: 'Mobile App Developer',
      rating: 4.7,
      hourlyRate: '$70/hr',
      image: 'https://source.unsplash.com/random/100x100/?portrait,asian'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          borderRadius: { xs: 0, md: '0 0 20px 20px' }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Find the perfect freelance services for your business
              </Typography>
              <Typography variant="h6" paragraph>
                Connect with talented freelancers and get your projects done quickly and efficiently.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  component={Link}
                  to="/jobs"
                  startIcon={<SearchIcon />}
                >
                  Find Jobs
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  component={Link}
                  to="/freelancers"
                >
                  Find Talent
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="https://source.unsplash.com/random/600x400/?freelance,work"
                alt="Freelancer working"
                sx={{ 
                  width: '100%', 
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose FreelancerHub
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Our platform offers everything you need to work with freelancers effectively
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <WorkIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quality Work
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find high-quality freelancers with verified skills and experience.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <PersonIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Top Talent
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access a global pool of skilled professionals for any project.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <PaymentIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Secure Payments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Escrow protection ensures you only pay for completed work.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <SecurityIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our team is always available to help with any issues.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Jobs Section */}
      <Box sx={{ bgcolor: theme.palette.background.paper, py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2">
              Featured Jobs
            </Typography>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/jobs"
            >
              View All Jobs
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredJobs.map(job => (
              <Grid item xs={12} md={4} key={job.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={job.image}
                    alt={job.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {job.company} • {job.location}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      {job.salary}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {job.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      component={Link}
                      to={`/jobs/${job.id}`}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Top Freelancers Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            Top Freelancers
          </Typography>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/freelancers"
          >
            View All Freelancers
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {topFreelancers.map(freelancer => (
            <Grid item xs={12} sm={6} md={4} key={freelancer.id}>
              <Card sx={{ display: 'flex', p: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80, borderRadius: '50%' }}
                  image={freelancer.image}
                  alt={freelancer.name}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                  <Typography variant="h6" component="h3">
                    {freelancer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {freelancer.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" fontWeight="bold" mr={2}>
                      ★ {freelancer.rating}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {freelancer.hourlyRate}
                    </Typography>
                  </Box>
                  <Button 
                    variant="text" 
                    size="small" 
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                    component={Link}
                    to={`/profile/${freelancer.id}`}
                  >
                    View Profile
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.secondary.main, 
          color: 'white',
          py: 8,
          borderRadius: { xs: 0, md: '20px' },
          mx: { xs: 0, md: 4 },
          my: 4
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Join thousands of freelancers and clients who trust our platform
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              to="/register"
              sx={{ bgcolor: 'white', color: theme.palette.secondary.main }}
            >
              Sign Up as Freelancer
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              component={Link}
              to="/register"
              sx={{ borderColor: 'white' }}
            >
              Sign Up as Client
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
