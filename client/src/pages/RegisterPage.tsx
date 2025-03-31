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
  Divider,
  Paper,
  Avatar,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stepper,
  Step,
  StepLabel,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [userType, setUserType] = useState('freelancer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Freelancer specific fields
    skills: '',
    hourlyRate: '',
    // Client specific fields
    company: '',
    position: ''
  });

  const steps = ['Account Type', 'Basic Information', 'Profile Details'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle registration logic here
    console.log(formData);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              I want to join as a:
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="user-type"
                name="user-type"
                value={userType}
                onChange={handleUserTypeChange}
              >
                <FormControlLabel 
                  value="freelancer" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="subtitle1">Freelancer</Typography>
                      <Typography variant="body2" color="text.secondary">
                        I want to find work and offer my services
                      </Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="client" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="subtitle1">Client</Typography>
                      <Typography variant="body2" color="text.secondary">
                        I want to hire freelancers and post jobs
                      </Typography>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            {userType === 'freelancer' ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="skills"
                    label="Skills (comma separated)"
                    name="skills"
                    placeholder="e.g. React, JavaScript, UI Design"
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="hourlyRate"
                    label="Hourly Rate ($)"
                    name="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="company"
                    label="Company Name"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="position"
                    label="Your Position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.secondary.main }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create an Account
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Create Account
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
            Sign in
          </Link>
        </Typography>
      </Box>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          By creating an account, you agree to our{' '}
          <Link to="/terms" style={{ color: theme.palette.primary.main }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" style={{ color: theme.palette.primary.main }}>
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
