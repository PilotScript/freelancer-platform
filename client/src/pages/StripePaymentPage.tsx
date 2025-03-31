import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardHeader,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Stripe Elements
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_51NxSample1234567890StripeKeyABCDEFGHIJKLMNOPQRSTUVWXYZ');

// Styled components
const PaymentMethodCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

// Styled Stripe Card Element
const StyledCardElement = styled(CardElement)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  padding: '10px 14px',
  borderRadius: theme.shape.borderRadius,
  '&:focus': {
    borderColor: theme.palette.primary.main,
  }
}));

// Mock job data (in a real app, this would come from API)
const mockJob = {
  id: '1',
  title: 'React Developer for E-commerce Website',
  client: {
    id: '101',
    name: 'TechSolutions Inc.',
    avatar: 'https://source.unsplash.com/random/100x100/?company,tech'
  },
  budget: 3000,
  paymentType: 'fixed',
  serviceFee: 300, // 10% service fee
  total: 3300
};

// CheckoutForm component (uses Stripe Elements)
const CheckoutForm = ({ jobData, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // In a real app, this would be an API call to your backend
        const response = await axios.post('/api/payments/create-intent', {
          jobId: jobData.id,
          amount: jobData.budget
        });
        
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
      } catch (err) {
        setError(err.message);
      }
    };

    createPaymentIntent();
  }, [jobData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (error) {
      elements.getElement('card').focus();
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card details');
      return;
    }

    setProcessing(true);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        },
      });

      setProcessing(false);

      if (payload.error) {
        setError(payload.error.message);
        onPaymentError(payload.error.message);
      } else {
        // Payment succeeded
        // In a real app, you would call your backend to record the payment
        try {
          await axios.post('/api/payments/confirm', {
            paymentIntentId: paymentIntentId,
            jobId: jobData.id
          });
          
          onPaymentSuccess(payload);
        } catch (err) {
          setError('Payment was processed but could not be recorded. Please contact support.');
          onPaymentError(err.message);
        }
      }
    } catch (err) {
      setProcessing(false);
      setError(err.message);
      onPaymentError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Name on Card"
            fullWidth
            required
            value={billingDetails.name}
            onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            fullWidth
            type="email"
            required
            value={billingDetails.email}
            onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Card Details
          </Typography>
          <StyledCardElement
            onChange={(e) => setCardComplete(e.complete)}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            required
            value={billingDetails.address.line1}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, line1: e.target.value }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="City"
            fullWidth
            required
            value={billingDetails.address.city}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, city: e.target.value }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="State"
            fullWidth
            required
            value={billingDetails.address.state}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, state: e.target.value }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="ZIP Code"
            fullWidth
            required
            value={billingDetails.address.postal_code}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, postal_code: e.target.value }
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={billingDetails.address.country}
              label="Country"
              onChange={(e) => setBillingDetails({
                ...billingDetails,
                address: { ...billingDetails.address, country: e.target.value }
              })}
            >
              <MenuItem value="US">United States</MenuItem>
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="UK">United Kingdom</MenuItem>
              <MenuItem value="AU">Australia</MenuItem>
              <MenuItem value="DE">Germany</MenuItem>
              <MenuItem value="FR">France</MenuItem>
              <MenuItem value="JP">Japan</MenuItem>
              <MenuItem value="IN">India</MenuItem>
              <MenuItem value="BR">Brazil</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!stripe || processing || !cardComplete}
              startIcon={processing ? <CircularProgress size={20} /> : <LockIcon />}
            >
              {processing ? 'Processing...' : `Pay $${jobData.total.toFixed(2)}`}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

const StripePaymentPage = () => {
  const theme = useTheme();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [jobData, setJobData] = useState(mockJob);

  // In a real app, you would fetch the job data
  useEffect(() => {
    // Fetch job data from API
    // const fetchJobData = async () => {
    //   try {
    //     const response = await axios.get(`/api/jobs/${jobId}`);
    //     setJobData(response.data);
    //   } catch (err) {
    //     console.error('Error fetching job data:', err);
    //   }
    // };
    // fetchJobData();
  }, [jobId]);

  // Steps for the payment process
  const steps = ['Payment Method', 'Payment Details', 'Review & Confirm'];

  // Handle payment method selection
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle payment success
  const handlePaymentSuccess = (payload) => {
    console.log('Payment successful:', payload);
    setPaymentComplete(true);
  };

  // Handle payment error
  const handlePaymentError = (errorMessage) => {
    console.error('Payment error:', errorMessage);
    setPaymentError(errorMessage);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Payment
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'
        }}
      >
        {paymentComplete ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" paragraph>
              Your payment of ${jobData.total.toFixed(2)} has been processed successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              A receipt has been sent to your email address.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </Box>
        ) : (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {paymentError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {paymentError}
              </Alert>
            )}
            
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Payment Method
                </Typography>
                
                <RadioGroup
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <PaymentMethodCard 
                        selected={paymentMethod === 'credit_card'}
                        onClick={() => setPaymentMethod('credit_card')}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <Radio 
                            value="credit_card" 
                            checked={paymentMethod === 'credit_card'} 
                            sx={{ mr: 1 }}
                          />
                          <CreditCardIcon sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle1">
                              Credit / Debit Card
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay with Visa, Mastercard, or other cards
                            </Typography>
                          </Box>
                        </CardContent>
                      </PaymentMethodCard>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <PaymentMethodCard 
                        selected={paymentMethod === 'bank_transfer'}
                        onClick={() => setPaymentMethod('bank_transfer')}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <Radio 
                            value="bank_transfer" 
                            checked={paymentMethod === 'bank_transfer'} 
                            sx={{ mr: 1 }}
                          />
                          <AccountBalanceIcon sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle1">
                              Bank Transfer
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay directly from your bank account
                            </Typography>
                          </Box>
                        </CardContent>
                      </PaymentMethodCard>
                    </Grid>
                  </Grid>
                </RadioGroup>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
                
                {paymentMethod === 'credit_card' && (
                 
(Content truncated due to size limit. Use line ranges to read in chunks)