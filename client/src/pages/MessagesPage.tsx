import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Divider,
  IconButton,
  InputAdornment,
  Badge,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

// Styled components
const MessageBubble = styled(Box)(({ theme, sent }) => ({
  backgroundColor: sent ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  color: sent ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: '18px',
  padding: '10px 16px',
  maxWidth: '70%',
  wordBreak: 'break-word',
  marginBottom: '8px',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    [sent ? 'right' : 'left']: '-10px',
    width: '20px',
    height: '20px',
    backgroundColor: sent ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: '50%',
    zIndex: -1
  }
}));

// Mock conversation data
const mockConversations = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Sarah Williams',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman',
      status: 'online'
    },
    lastMessage: {
      text: 'Hi, I wanted to discuss the project timeline.',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      unread: true
    }
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Michael Chen',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,man',
      status: 'offline'
    },
    lastMessage: {
      text: 'The design looks great! Can we schedule a call?',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      unread: false
    }
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Jessica Parker',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman',
      status: 'online'
    },
    lastMessage: {
      text: 'I've reviewed your proposal and I'm interested in moving forward.',
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      unread: true
    }
  },
  {
    id: '4',
    user: {
      id: '104',
      name: 'David Johnson',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,man',
      status: 'offline'
    },
    lastMessage: {
      text: 'Thanks for completing the project ahead of schedule!',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      unread: false
    }
  },
  {
    id: '5',
    user: {
      id: '105',
      name: 'Emma Thompson',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman',
      status: 'online'
    },
    lastMessage: {
      text: 'Can you provide an update on the current progress?',
      timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
      unread: false
    }
  }
];

// Mock messages for a conversation
const mockMessages = [
  {
    id: '1',
    sender: '101',
    recipient: 'currentUser',
    text: 'Hi there! I saw your profile and I'm interested in discussing a potential project.',
    timestamp: new Date(Date.now() - 2 * 86400000 - 3600000).toISOString(),
    read: true
  },
  {
    id: '2',
    sender: 'currentUser',
    recipient: '101',
    text: 'Hello! Thanks for reaching out. I'd be happy to discuss your project. What do you have in mind?',
    timestamp: new Date(Date.now() - 2 * 86400000 - 3000000).toISOString(),
    read: true
  },
  {
    id: '3',
    sender: '101',
    recipient: 'currentUser',
    text: 'I need a website for my small business. It should have an about page, services, portfolio, and contact form. Would you be available to work on this?',
    timestamp: new Date(Date.now() - 2 * 86400000 - 2400000).toISOString(),
    read: true
  },
  {
    id: '4',
    sender: 'currentUser',
    recipient: '101',
    text: 'That sounds like a project I can definitely help with. What's your timeline and budget for this?',
    timestamp: new Date(Date.now() - 2 * 86400000 - 1800000).toISOString(),
    read: true
  },
  {
    id: '5',
    sender: '101',
    recipient: 'currentUser',
    text: 'I'm looking to launch in about 4-6 weeks, and my budget is around $2,000-$3,000. Would that work for you?',
    timestamp: new Date(Date.now() - 1 * 86400000 - 3600000).toISOString(),
    read: true
  },
  {
    id: '6',
    sender: 'currentUser',
    recipient: '101',
    text: 'That timeline and budget work for me. I'd like to get a better understanding of your business and design preferences. Would you be available for a call this week?',
    timestamp: new Date(Date.now() - 1 * 86400000 - 3000000).toISOString(),
    read: true
  },
  {
    id: '7',
    sender: '101',
    recipient: 'currentUser',
    text: 'Yes, I'm available. How about Thursday at 2 PM EST?',
    timestamp: new Date(Date.now() - 1 * 86400000 - 2400000).toISOString(),
    read: true
  },
  {
    id: '8',
    sender: 'currentUser',
    recipient: '101',
    text: 'Thursday at 2 PM EST works for me. I'll send you a calendar invite with a video call link.',
    timestamp: new Date(Date.now() - 1 * 86400000 - 1800000).toISOString(),
    read: true
  },
  {
    id: '9',
    sender: '101',
    recipient: 'currentUser',
    text: 'Great! Looking forward to our call. In the meantime, here are some websites I like for reference: [website1.com, website2.com]',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    read: false
  }
];

// Format timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const MessagesPage: React.FC = () => {
  const theme = useTheme();
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    conversation => conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      setMessages(mockMessages);
      
      // Mark messages as read
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id && conv.lastMessage.unread) {
          return {
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              unread: false
            }
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
    }
  }, [activeConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      const newMsg = {
        id: `new-${Date.now()}`,
        sender: 'currentUser',
        recipient: activeConversation.user.id,
        text: newMessage,
        timestamp: new Date().toISOString(),
        read: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Update last message in conversation list
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            lastMessage: {
              text: newMessage,
              timestamp: new Date().toISOString(),
              unread: false
            }
          };
        }
        return conv;
      });
      
      // Move active conversation to top
      const activeConv = updatedConversations.find(conv => conv.id === activeConversation.id);
      const otherConvs = updatedConversations.filter(conv => conv.id !== activeConversation.id);
      setConversations([activeConv, ...otherConvs]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 150px)' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          height: 'calc(100% - 60px)', 
          display: 'flex',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Conversations List */}
        <Box 
          sx={{ 
            width: 320, 
            borderRight: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Search */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <TextField
              fullWidth
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {/* Conversations */}
          <List sx={{ overflow: 'auto', flexGrow: 1 }}>
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <React.Fragment key={conversation.id}>
                  <ListItem 
                    button 
                    alignItems="flex-start"
                    selected={activeConversation?.id === conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    sx={{ 
                      px: 2, 
                      py: 1.5,
                      backgroundColor: activeConversation?.id === conversation.id ? 
                        (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                        'transparent'
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        color={conversation.user.status === 'online' ? 'success' : 'default'}
                      >
                        <Avatar src={conversation.user.avatar} alt={conversation.user.name} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {conversation.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            variant="body2"
                            color={conversation.lastMessage.unread ? 'text.primary' : 'text.secondary'}
                            sx={{ 
                              display: 'inline', 
                              fontWeight: conversation.lastMessage.unread ? 'bold' : 'normal',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {conversation.lastMessage.text}
                          </Typography>
                          {conversation.lastMessage.unread && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                ml: 1
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No conversations found</Typography>
              </Box>
            )}
          </List>
        </Box>
        
        {/* Messages Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {activeConversation ? (
            <>
              {/* Conversation Header */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={activeConversation.user.status === 'online' ? 'success' : 'default'}
                  >
                    <Avatar 
                      src={activeConversation.user.avatar} 
                      alt={activeConversation.user.name}
                      sx={{ mr: 2 }}
                    />
                  </Badge>
                  <Box>
                    <Typography variant="subtitle1">
                      {activeConversation.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activeConversation.user.status === 'online' ? 'Online' : 'Offline'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              
              {/* Messages */}
              <Box 
                sx={{ 
                  p: 2, 
                  flexGrow: 1, 
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {messages.map((message) => (
                  <Box 
                    key={message.id} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: message.sender === 'currentUser' ? 'flex-end' :
(Content truncated due to size limit. Use line ranges to read in chunks)