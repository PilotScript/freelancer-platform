import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button, 
  Avatar, 
  Divider,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';

interface JobCardProps {
  job: {
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
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const theme = useTheme();

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate description
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to={`/jobs/${job.id}`}
            sx={{ 
              color: 'primary.main', 
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {job.title}
          </Typography>
          <Chip 
            label={job.category} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {truncateDescription(job.description)}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {job.skills.slice(0, 3).map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small" 
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              }}
            />
          ))}
          {job.skills.length > 3 && (
            <Chip 
              label={`+${job.skills.length - 3} more`} 
              size="small" 
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.paymentType === 'hourly' ? `$${job.budget}/hr` : `$${job.budget}`}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.duration === 'short' ? 'Less than 1 month' : 
               job.duration === 'medium' ? '1-3 months' : 
               'More than 3 months'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={job.client.avatar} 
              alt={job.client.name}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography variant="body2">
                {job.client.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posted {formatDate(job.createdAt)}
              </Typography>
            </Box>
          </Box>
          
          <Button 
            variant="contained" 
            size="small" 
            component={Link}
            to={`/jobs/${job.id}`}
            endIcon={<WorkIcon />}
          >
            Apply Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
