import React, { useState } from 'react';
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
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

// Mock job data
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

const PaymentPage: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('US');
  const [errors, setErrors] = useState({});
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Steps for the payment process
  const steps = ['Payment Method', 'Payment Details', 'Review & Confirm'];

  // Handle payment method selection
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit_card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s+/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!cardName.trim()) {
        newErrors.cardName = 'Please enter the name on card';
      }
      
      if (!expiryDate.trim() || expiryDate.length < 5) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!cvv.trim() || cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }
    
    if (!billingAddress.trim()) {
      newErrors.billingAddress = 'Please enter your billing address';
    }
    
    if (!city.trim()) {
      newErrors.city = 'Please enter your city';
    }
    
    if (!state.trim()) {
      newErrors.state = 'Please enter your state/province';
    }
    
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Please enter your ZIP/postal code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep === 1 && !validateForm()) {
      return;
    }
    
    if (activeStep === steps.length - 1) {
      // Process payment
      processPayment();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Process payment (mock)
  const processPayment = () => {
    // Simulate API call
    setTimeout(() => {
      // Simulate successful payment
      setPaymentComplete(true);
      
      // In a real app, you would call your payment API here
      console.log({
        paymentMethod,
        cardNumber: cardNumber.replace(/\s+/g, ''),
        cardName,
        expiryDate,
        cvv,
        billingAddress,
        city,
        state,
        zipCode,
        country,
        amount: mockJob.total,
        jobId: mockJob.id
      });
    }, 2000);
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
              Your payment of ${mockJob.total.toFixed(2)} has been processed successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              A receipt has been sent to your email address.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              href="/dashboard"
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
              </Box>
            )}
            
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
                
                {paymentMethod === 'credit_card' && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        InputProps={{
                          startAdornment: (
                            <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name on Card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate}
                        placeholder="MM/YY"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                        placeholder="123"
                        InputProps={{
                          startAdornment: (
                            <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
                
                {paymentMethod === 'bank_transfer' && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    You will be redirected to your bank's website to complete the payment after reviewing your order.
                  </Alert>
                )}
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Billing Address
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      error={!!errors.billingAddress}
                      helperText={errors.billingAddress}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      error={!!errors.state}
                      helperText={errors.state}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ZIP/Postal Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      error={!!errors.zipCode}
                      helperText={errors.zipCode}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="country-label">Country</InputLabel>
                      <Select
                        labelId="country-label"
                        value={country}
                        label="Country"
                        onChange={(e: SelectChangeEvent) => setCountry(e.target.value)}
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
                </Grid>
              </Box>
            )}
            
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review Your Payment
                </Typography>
                
                
(Content truncated due to size limit. Use line ranges to read in chunks)