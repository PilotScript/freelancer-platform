import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Grid, 
  IconButton, 
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: { xs: 4, md: 6 },
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/" 
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                fontWeight: 700,
                display: 'block',
                mb: 2
              }}
            >
              FreelancerHub
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connect with top freelancers and find quality jobs. 
              Our platform makes it easy to hire talent and find work 
              in web development, design, writing, and more.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton size="small" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton size="small" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Quick links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              For Freelancers
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/jobs" color="inherit" underline="hover">
                  Find Jobs
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/profile/create" color="inherit" underline="hover">
                  Create Profile
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/proposals" color="inherit" underline="hover">
                  Proposals
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/payment" color="inherit" underline="hover">
                  Get Paid
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* More links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              For Clients
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/jobs/post" color="inherit" underline="hover">
                  Post a Job
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/freelancers" color="inherit" underline="hover">
                  Find Freelancers
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/payment/methods" color="inherit" underline="hover">
                  Payment Methods
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/enterprise" color="inherit" underline="hover">
                  Enterprise
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* Resources */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/help" color="inherit" underline="hover">
                  Help & Support
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/blog" color="inherit" underline="hover">
                  Blog
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/community" color="inherit" underline="hover">
                  Community
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/success-stories" color="inherit" underline="hover">
                  Success Stories
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* Company */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                  About Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/careers" color="inherit" underline="hover">
                  Careers
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/press" color="inherit" underline="hover">
                  Press
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                  Contact Us
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} FreelancerHub. All rights reserved.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: isTablet ? 'column' : 'row',
              gap: isTablet ? 1 : 3,
              alignItems: 'center'
            }}
          >
            <Link component={RouterLink} to="/terms" color="text.secondary" underline="hover">
              <Typography variant="body2">
                Terms of Service
              </Typography>
            </Link>
            <Link component={RouterLink} to="/privacy" color="text.secondary" underline="hover">
              <Typography variant="body2">
                Privacy Policy
              </Typography>
            </Link>
            <Link component={RouterLink} to="/cookies" color="text.secondary" underline="hover">
              <Typography variant="body2">
                Cookie Policy
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
