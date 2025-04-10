import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Flex,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';

const ChatWidget = ({ userName = 'Alex Johnson' }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'agent',
      text: `Hi there! I'm the AI agent for ${userName}. I can tell you about ${userName}'s content, interests, and expertise. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const userBubbleColor = useColorModeValue('brand.500', 'brand.400');
  const agentBubbleColor = useColorModeValue('gray.100', 'gray.700');
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: String(messages.length + 1),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    // In a real implementation, this would be an API call
    // For the prototype, we'll simulate a response
    setTimeout(() => {
      generateResponse(input);
      setLoading(false);
    }, 1000);
  };
  
  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    let responseText = '';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      responseText = `Hello! I'm ${userName}'s AI agent. How can I help you today?`;
    } else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      responseText = `I'm an AI agent that represents ${userName}. I've learned from their social media posts, articles, and online presence to help answer questions and engage with their audience.`;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      responseText = `You can contact ${userName} directly via email at ${userName.toLowerCase().replace(' ', '.')}@example.com or through any of the social media platforms listed above.`;
    } else if (lowerMessage.includes('content') || lowerMessage.includes('post') || lowerMessage.includes('article')) {
      responseText = `${userName} regularly posts content about AI, technology trends, and digital innovation. Their most recent articles focus on machine learning applications and the future of AI assistants. Check out their blog for the latest posts!`;
    } else if (lowerMessage.includes('interest') || lowerMessage.includes('hobby') || lowerMessage.includes('like')) {
      responseText = `${userName} is passionate about artificial intelligence, emerging technologies, digital art, and hiking. They often share their thoughts on these topics across their social platforms.`;
    } else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('machine learning')) {
      responseText = `${userName} has extensive expertise in AI and machine learning. They've written about neural networks, deep learning, AI ethics, and practical applications of machine learning in business. Is there a specific aspect of AI you'd like to know more about?`;
    } else if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('digital')) {
      responseText = `${userName} follows technology trends closely and writes about digital transformation, innovation, and emerging technologies. They're particularly interested in how technology can solve real-world problems.`;
    } else {
      responseText = `Thanks for your message! ${userName} is interested in AI, technology, and digital innovation. Is there something specific you'd like to know about their work or interests?`;
    }
    
    const agentMessage = {
      id: String(messages.length + 2),
      sender: 'agent',
      text: responseText,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, agentMessage]);
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg={bgColor}
      height="500px"
      display="flex"
      flexDirection="column"
    >
      {/* Chat Header */}
      <Box p={4} bg="brand.500" color="white">
        <Text fontWeight="bold">{userName}'s AI Agent</Text>
      </Box>
      
      {/* Messages */}
      <VStack
        flex="1"
        overflowY="auto"
        p={4}
        spacing={4}
        align="stretch"
      >
        {messages.map((message) => (
          <Flex
            key={message.id}
            justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
          >
            {message.sender === 'agent' && (
              <Avatar
                size="sm"
                name={userName}
                src="https://randomuser.me/api/portraits/men/32.jpg"
                mr={2}
              />
            ) }
            <Box
              maxW="70%"
              p={3}
              borderRadius="lg"
              bg={message.sender === 'user' ? userBubbleColor : agentBubbleColor}
              color={message.sender === 'user' ? 'white' : 'black'}
            >
              <Text>{message.text}</Text>
              <Text fontSize="xs" color={message.sender === 'user' ? 'whiteAlpha.800' : 'gray.500'} textAlign="right" mt={1}>
                {formatTime(message.timestamp)}
              </Text>
            </Box>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </VStack>
      
      <Divider />
      
      {/* Input */}
      <HStack p={4} spacing={2}>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button
          colorScheme="brand"
          onClick={handleSendMessage}
          isLoading={loading}
          leftIcon={<FaPaperPlane />}
        >
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatWidget;
