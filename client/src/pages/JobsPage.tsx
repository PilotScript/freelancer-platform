import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  TextField, 
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Chip,
  Button,
  Pagination,
  Divider,
  Paper,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import JobCard from '../components/jobs/JobCard';

// Mock data for job listings
const mockJobs = [
  {
    id: '1',
    title: 'React Developer for E-commerce Website',
    description: 'Looking for an experienced React developer to build a modern e-commerce website with shopping cart, payment integration, and admin dashboard.',
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
  },
  {
    id: '2',
    title: 'UI/UX Designer for Mobile App',
    description: 'We need a talented UI/UX designer to create beautiful and intuitive interfaces for our iOS and Android fitness application.',
    budget: 50,
    paymentType: 'hourly',
    duration: 'short',
    location: 'Remote',
    category: 'Design',
    skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Mobile Design'],
    createdAt: '2025-03-26T14:15:00Z',
    client: {
      id: '102',
      name: 'FitTech Solutions',
      avatar: 'https://source.unsplash.com/random/100x100/?company,fitness'
    }
  },
  {
    id: '3',
    title: 'Full Stack Developer for SaaS Platform',
    description: 'Seeking a full stack developer to help build and maintain our growing SaaS platform. Experience with React, Node.js, and AWS required.',
    budget: 6000,
    paymentType: 'fixed',
    duration: 'long',
    location: 'Remote',
    category: 'Programming',
    skills: ['React', 'Node.js', 'AWS', 'MongoDB', 'TypeScript', 'Express'],
    createdAt: '2025-03-27T09:45:00Z',
    client: {
      id: '103',
      name: 'CloudWare Systems',
      avatar: 'https://source.unsplash.com/random/100x100/?company,cloud'
    }
  },
  {
    id: '4',
    title: 'Content Writer for Technology Blog',
    description: 'We are looking for a skilled content writer to create engaging articles about the latest technology trends, software development, and digital innovation.',
    budget: 35,
    paymentType: 'hourly',
    duration: 'medium',
    location: 'Remote',
    category: 'Writing',
    skills: ['Content Writing', 'SEO', 'Technology', 'Blogging', 'Research'],
    createdAt: '2025-03-28T11:20:00Z',
    client: {
      id: '104',
      name: 'TechBlog Media',
      avatar: 'https://source.unsplash.com/random/100x100/?company,media'
    }
  },
  {
    id: '5',
    title: 'WordPress Developer for Corporate Website',
    description: 'Need an experienced WordPress developer to create a professional corporate website with custom theme development and plugin integration.',
    budget: 2500,
    paymentType: 'fixed',
    duration: 'short',
    location: 'Remote',
    category: 'Programming',
    skills: ['WordPress', 'PHP', 'JavaScript', 'HTML', 'CSS', 'MySQL'],
    createdAt: '2025-03-29T16:10:00Z',
    client: {
      id: '105',
      name: 'Global Enterprises',
      avatar: 'https://source.unsplash.com/random/100x100/?company,corporate'
    }
  },
  {
    id: '6',
    title: 'Social Media Marketing Specialist',
    description: 'Looking for a social media expert to manage our accounts, create engaging content, and grow our online presence across multiple platforms.',
    budget: 40,
    paymentType: 'hourly',
    duration: 'long',
    location: 'Remote',
    category: 'Marketing',
    skills: ['Social Media', 'Content Creation', 'Analytics', 'Advertising', 'Copywriting'],
    createdAt: '2025-03-30T13:25:00Z',
    client: {
      id: '106',
      name: 'Brand Boosters',
      avatar: 'https://source.unsplash.com/random/100x100/?company,marketing'
    }
  }
];

// Categories for filter
const categories = [
  'All Categories',
  'Programming',
  'Design',
  'Writing',
  'Marketing',
  'Admin',
  'Customer Service',
  'Sales',
  'Other'
];

// Payment types for filter
const paymentTypes = [
  'All Types',
  'Hourly',
  'Fixed'
];

// Duration options for filter
const durations = [
  'Any Duration',
  'Short Term',
  'Medium Term',
  'Long Term'
];

const JobsPage: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [paymentType, setPaymentType] = useState('All Types');
  const [duration, setDuration] = useState('Any Duration');
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [page, setPage] = useState(1);
  const jobsPerPage = 4;

  // Apply filters
  useEffect(() => {
    let results = mockJobs;
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (category !== 'All Categories') {
      results = results.filter(job => job.category === category);
    }
    
    // Apply payment type filter
    if (paymentType !== 'All Types') {
      const paymentTypeValue = paymentType.toLowerCase();
      results = results.filter(job => job.paymentType === paymentTypeValue);
    }
    
    // Apply duration filter
    if (duration !== 'Any Duration') {
      let durationValue = '';
      if (duration === 'Short Term') durationValue = 'short';
      if (duration === 'Medium Term') durationValue = 'medium';
      if (duration === 'Long Term') durationValue = 'long';
      
      results = results.filter(job => job.duration === durationValue);
    }
    
    // Apply budget range filter
    results = results.filter(job => {
      if (job.paymentType === 'hourly') {
        return job.budget >= budgetRange[0] && job.budget <= budgetRange[1];
      } else {
        return job.budget >= budgetRange[0] && job.budget <= budgetRange[1];
      }
    });
    
    setFilteredJobs(results);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, category, paymentType, duration, budgetRange]);

  // Handle pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Calculate pagination
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find Jobs
      </Typography>
      
      {/* Search and Filter Bar */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search jobs by title, description, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ height: '100%' }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Grid>
        </Grid>
        
        {showFilters && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    label="Category"
                    onChange={(e: SelectChangeEvent) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="payment-type-label">Payment Type</InputLabel>
                  <Select
                    labelId="payment-type-label"
                    value={paymentType}
                    label="Payment Type"
                    onChange={(e: SelectChangeEvent) => setPaymentType(e.target.value)}
                  >
                    {paymentTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="duration-label">Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    value={duration}
                    label="Duration"
                    onChange={(e: SelectChangeEvent) => setDuration(e.target.value)}
                  >
                    {durations.map((dur) => (
                      <MenuItem key={dur} value={dur}>{dur}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography gutterBottom>
                  Budget Range
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={budgetRange}
                    onChange={(e, newValue) => setBudgetRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      ${budgetRange[0]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${budgetRange[1]}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                sx={{ mr: 1 }}
                onClick={() => {
                  setSearchTerm('');
                  setCategory('All Categories');
                  setPaymentType('All Types');
                  setDuration('Any Duration');
                  setBudgetRange([0, 10000]);
                }}
              >
                Clear Filters
              </Button>
              <Button 
                variant="contained"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Results Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          {filteredJobs.length} jobs found
        </Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value="newest"
            label="Sort By"
            size="small"
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="highest">Highest Budget</MenuItem>
            <MenuItem value="lowest">Lowest Budget</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Job Listings */}
      {currentJobs.length > 0 ? (
        <>
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
              showFirstButton 
              showLastButton
            />
          </Box>
        </>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            No jobs found matching your criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search filters or browse all available jobs
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setCategory('All Categories');
              setPaymentType('All Types');
              setDuration('Any Duration');
              setBudgetRange([0, 10000]);
            }}
          >
            View All Jobs
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default JobsPage;
