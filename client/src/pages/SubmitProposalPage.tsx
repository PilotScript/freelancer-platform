import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';

interface JobDetailProps {
  id: string;
  title: string;
  description: string;
  budget: number;
  paymentType: string;
  duration: string;
  location: string;
  category: string;
  skills: string[];
  createdAt: string;
  client: {
    id: string;
    name: string;
    avatar: string;
  };
}

// Mock job data
const mockJobDetail: JobDetailProps = {
  id: '1',
  title: 'React Developer for E-commerce Website',
  description: `We are looking for an experienced React developer to build a modern e-commerce website. The project includes:

- Responsive design implementation
- Shopping cart functionality
- Payment gateway integration (Stripe)
- User authentication and profiles
- Admin dashboard for product management
- Order tracking and history
- Wishlist and favorites
- Product reviews and ratings

The ideal candidate should have at least 2 years of experience with React and be familiar with state management solutions like Redux or Context API. Experience with Node.js and MongoDB is a plus.

We're looking for someone who can start immediately and deliver high-quality code with proper documentation.`,
  budget: 3000,
  paymentType: 'fixed',
  duration: 'medium',
  location: 'Remote',
  category: 'Programming',
  skills: ['React', 'JavaScript', 'CSS', 'Node.js', 'MongoDB'],
  createdAt: '2025-03-25T10:30:00Z',
  client: {
    id: '101',
    name: 'TechSolutions Inc.',
    avatar: 'https://source.unsplash.com/random/100x100/?company,tech'
  }
};

const SubmitProposalPage: React.FC = () => {
  const theme = useTheme();
  const { jobId } = useParams<{ jobId: string }>();
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedAmount, setProposedAmount] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState({
    coverLetter: '',
    proposedAmount: '',
    estimatedDuration: ''
  });

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      coverLetter: '',
      proposedAmount: '',
      estimatedDuration: ''
    };

    if (!coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
      valid = false;
    } else if (coverLetter.length < 100) {
      newErrors.coverLetter = 'Cover letter should be at least 100 characters';
      valid = false;
    }

    if (!proposedAmount) {
      newErrors.proposedAmount = 'Proposed amount is required';
      valid = false;
    } else if (isNaN(Number(proposedAmount)) || Number(proposedAmount) <= 0) {
      newErrors.proposedAmount = 'Please enter a valid amount';
      valid = false;
    }

    if (!estimatedDuration) {
      newErrors.estimatedDuration = 'Estimated duration is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      // Here you would submit the proposal to the backend
      console.log({
        jobId,
        coverLetter,
        proposedAmount,
        estimatedDuration,
        files
      });
      
      // Show success message or redirect
      alert('Proposal submitted successfully!');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Submit a Proposal
      </Typography>
      
      {/* Job Summary */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Typography variant="h6" gutterBottom>
          {mockJobDetail.title}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Category:</strong> {mockJobDetail.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Budget:</strong> ${mockJobDetail.budget} ({mockJobDetail.paymentType})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Duration:</strong> {
              mockJobDetail.duration === 'short' ? 'Less than 1 month' : 
              mockJobDetail.duration === 'medium' ? '1-3 months' : 
              'More than 3 months'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Posted:</strong> {formatDate(mockJobDetail.createdAt)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {mockJobDetail.skills.map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small" 
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>
      
      {/* Proposal Form */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Cover Letter */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Cover Letter
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Introduce yourself and explain why you're a good fit for this job.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Write your cover letter here..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                error={!!errors.coverLetter}
                helperText={errors.coverLetter}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Proposed Amount */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Your Proposed Terms
              </Typography>
              <TextField
                fullWidth
                label="Proposed Amount"
                placeholder={mockJobDetail.paymentType === 'hourly' ? "Hourly Rate ($)" : "Total Amount ($)"}
                value={proposedAmount}
                onChange={(e) => setProposedAmount(e.target.value)}
                error={!!errors.proposedAmount}
                helperText={errors.proposedAmount || `Propose your ${mockJobDetail.paymentType === 'hourly' ? 'hourly rate' : 'total amount'}`}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                }}
              />
            </Grid>
            
            {/* Estimated Duration */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Estimated Duration
              </Typography>
              <FormControl fullWidth error={!!errors.estimatedDuration}>
                <InputLabel id="duration-label">Estimated Duration</InputLabel>
                <Select
                  labelId="duration-label"
                  value={estimatedDuration}
                  label="Estimated Duration"
                  onChange={(e: SelectChangeEvent) => setEstimatedDuration(e.target.value)}
                >
                  <MenuItem value="less_than_1_week">Less than 1 week</MenuItem>
                  <MenuItem value="1_to_2_weeks">1-2 weeks</MenuItem>
                  <MenuItem value="2_to_4_weeks">2-4 weeks</MenuItem>
                  <MenuItem value="1_to_3_months">1-3 months</MenuItem>
                  <MenuItem value="3_to_6_months">3-6 months</MenuItem>
                  <MenuItem value="more_than_6_months">More than 6 months</MenuItem>
                </Select>
                {errors.estimatedDuration && (
                  <FormHelperText>{errors.estimatedDuration}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* File Attachments */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Attachments
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Add work samples or other documents to support your proposal.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>
              
              {/* File List */}
              {files.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attached Files:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    {files.map((file, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          py: 1,
                          borderBottom: index < files.length - 1 ? `1px solid ${theme.palette.divider}` : 'none'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachFileIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </Typography>
                        </Box>
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleRemoveFile(index)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  type="submit"
                  endIcon={<SendIcon />}
                >
                  Submit Proposal
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SubmitProposalPage;
