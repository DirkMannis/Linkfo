import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  useColorModeValue,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaTwitter, FaInstagram, FaYoutube, FaGlobe, FaLink } from 'react-icons/fa';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function Dashboard({ isAuthenticated, setIsAuthenticated }) {
  const router = useRouter();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState([]);
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: 'FaLink',
    color: '#0080FF'
  });
  
  const [newSource, setNewSource] = useState({
    type: 'twitter',
    username: '',
    url: ''
  });
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In a real implementation, these would be actual API calls
      // For the prototype, we'll use mock data
      
      // Mock user data
      const userData = {
        id: '1',
        name: 'Alex Johnson',
        email: 'user@example.com',
        bio: 'AI researcher and technology enthusiast',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      // Mock links data
      const linksData = [
        {
          id: '1',
          title: 'My Website',
          url: 'https://alexjohnson.com',
          icon: 'FaGlobe',
          color: '#0080FF',
          position: 1,
          clicks: 324
        },
        {
          id: '2',
          title: 'Twitter',
          url: 'https://twitter.com/alexjohnson',
          icon: 'FaTwitter',
          color: '#1DA1F2',
          position: 2,
          clicks: 189
        },
        {
          id: '3',
          title: 'YouTube Channel',
          url: 'https://youtube.com/alexjohnson',
          icon: 'FaYoutube',
          color: '#FF0000',
          position: 3,
          clicks: 218
        },
        {
          id: '4',
          title: 'My Latest Article',
          url: 'https://medium.com/@alexjohnson/latest',
          icon: 'FaMedium',
          color: '#00AB6C',
          position: 4,
          clicks: 136
        }
      ];
      
      // Mock stats data
      const statsData = {
        profileViews: 1245,
        linkClicks: 867,
        chatInteractions: 342,
        topLinks: [
          { id: '1', title: 'My Website', clicks: 324 },
          { id: '3', title: 'YouTube Channel', clicks: 218 },
          { id: '2', title: 'Twitter', clicks: 189 }
        ]
      };
      
      // Mock sources data
      const sourcesData = [
        {
          id: '1',
          type: 'twitter',
          username: 'alexjohnson',
          status: 'connected',
          last_updated: '2025-04-07T15:30:00Z'
        },
        {
          id: '2',
          type: 'instagram',
          username: 'alexjohnson',
          status: 'connected',
          last_updated: '2025-04-07T15:35:00Z'
        },
        {
          id: '3',
          type: 'blog',
          url: 'https://alexjohnson.blog',
          status: 'connected',
          last_updated: '2025-04-07T16:00:00Z'
        }
      ];
      
      // Mock persona data
      const personaData = {
        user_id: '1',
        version: '0.1',
        updated_at: '2025-04-08T12:00:00Z',
        knowledge_domains: {
          'Artificial Intelligence': {
            expertise_level: 0.85,
            keywords: ['machine learning', 'neural networks', 'deep learning']
          },
          'Technology': {
            expertise_level: 0.75,
            keywords: ['digital transformation', 'innovation', 'tech trends']
          }
        },
        communication_style: {
          formality: 'neutral',
          verbosity: 'moderate',
          expressiveness: 'moderately_expressive'
        },
        personality_traits: {
          positivity: {
            value: 'positive',
            confidence: 0.82
          },
          analytical_thinking: {
            value: 'highly_analytical',
            confidence: 0.75
          }
        },
        content_sample_size: 250
      };
      
      setUser(userData) ;
      setLinks(linksData);
      setStats(statsData);
      setSources(sourcesData);
      setPersona(personaData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddLink = () => {
    // Validate form
    if (!newLink.title || !newLink.url) {
      toast({
        title: 'Error',
        description: 'Title and URL are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Add http:// if missing
    let url = newLink.url;
    if (!url.startsWith('http://')  && !url.startsWith('https://') ) {
      url = 'https://' + url;
    }
    
    // Create new link object
    const link = {
      id: String(links.length + 1) ,
      title: newLink.title,
      url: url,
      icon: newLink.icon,
      color: newLink.color,
      position: links.length + 1,
      clicks: 0
    };
    
    // Add to links array
    setLinks([...links, link]);
    
    // Reset form
    setNewLink({
      title: '',
      url: '',
      icon: 'FaLink',
      color: '#0080FF'
    });
    
    toast({
      title: 'Success',
      description: 'Link added successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleDeleteLink = (id) => {
    // Filter out the link to delete
    const updatedLinks = links.filter(link => link.id !== id);
    
    // Update positions
    updatedLinks.forEach((link, index) => {
      link.position = index + 1;
    });
    
    setLinks(updatedLinks);
    
    toast({
      title: 'Success',
      description: 'Link deleted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleAddSource = () => {
    // Validate form
    if (newSource.type === 'blog' && !newSource.url) {
      toast({
        title: 'Error',
        description: 'URL is required for blog sources',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (newSource.type !== 'blog' && !newSource.username) {
      toast({
        title: 'Error',
        description: 'Username is required for social media sources',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create new source object
    const source = {
      id: String(sources.length + 1),
      type: newSource.type,
      username: newSource.type !== 'blog' ? newSource.username : '',
      url: newSource.type === 'blog' ? newSource.url : '',
      status: 'connected',
      last_updated: new Date().toISOString()
    };
    
    // Add to sources array
    setSources([...sources, source]);
    
    // Reset form
    setNewSource({
      type: 'twitter',
      username: '',
      url: ''
    });
    
    toast({
      title: 'Success',
      description: 'Content source added successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleUpdatePersona = () => {
    toast({
      title: 'Updating Persona',
      description: 'Your persona is being updated based on your content. This may take a few minutes.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
    
    // In a real implementation, this would trigger the persona learning process
    // For the prototype, we'll just update the timestamp
    setPersona({
      ...persona,
      updated_at: new Date().toISOString()
    });
  };
  
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Update authentication state
    setIsAuthenticated(false);
    
    // Redirect to home page
    router.push('/');
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to render the correct icon
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'FaTwitter':
        return <FaTwitter />;
      case 'FaInstagram':
        return <FaInstagram />;
      case 'FaYoutube':
        return <FaYoutube />;
      case 'FaGlobe':
        return <FaGlobe />;
      default:
        return <FaLink />;
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <Container maxW="container.lg" py={10}>
          <Text>Loading dashboard...</Text>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Container maxW="container.lg" py={10}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading as="h1" size="xl">Dashboard</Heading>
          <Button onClick={handleLogout} colorScheme="red" variant="outline">Logout</Button>
        </Flex>
        
        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat bg={bgColor} p={4} borderRadius="md" boxShadow="md">
            <StatLabel>Profile Views</StatLabel>
            <StatNumber>{stats?.profileViews}</StatNumber>
            <StatHelpText>Last 30 days</StatHelpText>
          </Stat>
          <Stat bg={bgColor} p={4} borderRadius="md" boxShadow="md">
            <StatLabel>Link Clicks</StatLabel>
            <StatNumber>{stats?.linkClicks}</StatNumber>
            <StatHelpText>Last 30 days</StatHelpText>
          </Stat>
          <Stat bg={bgColor} p={4} borderRadius="md" boxShadow="md">
            <StatLabel>Chat Interactions</StatLabel>
            <StatNumber>{stats?.chatInteractions}</StatNumber>
            <StatHelpText>Last 30 days</StatHelpText>
          </Stat>
        </SimpleGrid>
        
        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab>Links</Tab>
            <Tab>Content Sources</Tab>
            <Tab>Persona</Tab>
            <Tab>Settings</Tab>
          </TabList>
          
          <TabPanels>
            {/* Links Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                  <Heading as="h3" size="md" mb={4}>Add New Link</Heading>
                  <HStack spacing={4} mb={4}>
                    <FormControl isRequired>
                      <FormLabel>Title</FormLabel>
                      <Input 
                        value={newLink.title}
                        onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                        placeholder="My Website"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>URL</FormLabel>
                      <Input 
                        value={newLink.url}
                        onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </FormControl>
                  </HStack>
                  <HStack spacing={4} mb={4}>
                    <FormControl>
                      <FormLabel>Icon</FormLabel>
                      <Select 
                        value={newLink.icon}
                        onChange={(e)  => setNewLink({...newLink, icon: e.target.value})}
                      >
                        <option value="FaLink">Link</option>
                        <option value="FaGlobe">Website</option>
                        <option value="FaTwitter">Twitter</option>
                        <option value="FaInstagram">Instagram</option>
                        <option value="FaYoutube">YouTube</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Color</FormLabel>
                      <Input 
                        type="color"
                        value={newLink.color}
                        onChange={(e) => setNewLink({...newLink, color: e.target.value})}
                      />
                    </FormControl>
                  </HStack>
                  <Button 
                    leftIcon={<FaPlus />}
                    colorScheme="brand"
                    onClick={handleAddLink}
                  >
                    Add Link
                  </Button>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading as="h3" size="md" mb={4}>Your Links</Heading>
                  <VStack spacing={4} align="stretch">
                    {links.map((link) => (
                      <Flex 
                        key={link.id}
                        bg={bgColor}
                        p={4}
                        borderRadius="md"
                        boxShadow="sm"
                        justify="space-between"
                        align="center"
                        borderLeft="4px solid"
                        borderColor={link.color}
                      >
                        <HStack spacing={4}>
                          <Box color={link.color}>
                            {renderIcon(link.icon)}
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">{link.title}</Text>
                            <Text fontSize="sm" color="gray.500">{link.url}</Text>
                          </VStack>
                        </HStack>
                        <HStack>
                          <Text fontSize="sm" color="gray.500">{link.clicks} clicks</Text>
                          <IconButton
                            icon={<FaTrash />}
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            aria-label="Delete link"
                            onClick={() => handleDeleteLink(link.id)}
                          />
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>
            
            {/* Content Sources Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                  <Heading as="h3" size="md" mb={4}>Add Content Source</Heading>
                  <HStack spacing={4} mb={4}>
                    <FormControl>
                      <FormLabel>Source Type</FormLabel>
                      <Select 
                        value={newSource.type}
                        onChange={(e) => setNewSource({...newSource, type: e.target.value})}
                      >
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="blog">Blog/Website</option>
                      </Select>
                    </FormControl>
                    {newSource.type === 'blog' ? (
                      <FormControl isRequired>
                        <FormLabel>Website URL</FormLabel>
                        <Input 
                          value={newSource.url}
                          onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                          placeholder="https://yourblog.com"
                        />
                      </FormControl>
                    )  : (
                      <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input 
                          value={newSource.username}
                          onChange={(e) => setNewSource({...newSource, username: e.target.value})}
                          placeholder="yourusername"
                        />
                      </FormControl>
                    )}
                  </HStack>
                  <Button 
                    leftIcon={<FaPlus />}
                    colorScheme="brand"
                    onClick={handleAddSource}
                  >
                    Add Source
                  </Button>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading as="h3" size="md" mb={4}>Connected Sources</Heading>
                  <VStack spacing={4} align="stretch">
                    {sources.map((source) => (
                      <Flex 
                        key={source.id}
                        bg={bgColor}
                        p={4}
                        borderRadius="md"
                        boxShadow="sm"
                        justify="space-between"
                        align="center"
                      >
                        <HStack spacing={4}>
                          <Box color={
                            source.type === 'twitter' ? '#1DA1F2' :
                            source.type === 'instagram' ? '#E1306C' :
                            source.type === 'youtube' ? '#FF0000' :
                            '#0080FF'
                          }>
                            {
                              source.type === 'twitter' ? <FaTwitter /> :
                              source.type === 'instagram' ? <FaInstagram /> :
                              source.type === 'youtube' ? <FaYoutube /> :
                              <FaGlobe />
                            }
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">
                              {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {source.username || source.url}
                            </Text>
                          </VStack>
                        </HStack>
                        <HStack>
                          <Text 
                            fontSize="sm" 
                            color={source.status === 'connected' ? 'green.500' : 'red.500'}
                          >
                            {source.status}
                          </Text>
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
                
                <Box mt={4}>
                  <Button 
                    colorScheme="brand"
                    onClick={handleUpdatePersona}
                    isDisabled={sources.length === 0}
                  >
                    Update Persona from Sources
                  </Button>
                </Box>
              </VStack>
            </TabPanel>
            
            {/* Persona Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                  <Heading as="h3" size="md" mb={4}>Your AI Agent Persona</Heading>
                  <Text mb={4}>
                    Last updated: {new Date(persona?.updated_at).toLocaleString()}
                  </Text>
                  <Text mb={4}>
                    Based on {persona?.content_sample_size} content items
                  </Text>
                  
                  <Heading as="h4" size="sm" mt={6} mb={2}>Knowledge Domains</Heading>
                  <VStack align="stretch" spacing={2} mb={4}>
                    {persona?.knowledge_domains && Object.entries(persona.knowledge_domains).map(([domain, data]) => (
                      <Box key={domain} p={3} bg="gray.50" borderRadius="md">
                        <Flex justify="space-between">
                          <Text fontWeight="medium">{domain}</Text>
                          <Text>{Math.round(data.expertise_level * 100)}% expertise</Text>
                        </Flex>
                        <Text fontSize="sm" color="gray.600">
                          Keywords: {data.keywords.join(', ')}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                  
                  <Heading as="h4" size="sm" mt={6} mb={2}>Communication Style</Heading>
                  <SimpleGrid columns={3} spacing={4} mb={4}>
                    <Box p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="medium">Formality</Text>
                      <Text>{persona?.communication_style.formality}</Text>
                    </Box>
                    <Box p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="medium">Verbosity</Text>
                      <Text>{persona?.communication_style.verbosity}</Text>
                    </Box>
                    <Box p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="medium">Expressiveness</Text>
                      <Text>{persona?.communication_style.expressiveness}</Text>
                    </Box>
                  </SimpleGrid>
                  
                  <Heading as="h4" size="sm" mt={6} mb={2}>Personality Traits</Heading>
                  <VStack align="stretch" spacing={2} mb={4}>
                    {persona?.personality_traits && Object.entries(persona.personality_traits).map(([trait, data]) => (
                      <Box key={trait} p={3} bg="gray.50" borderRadius="md">
                        <Flex justify="space-between">
                          <Text fontWeight="medium">
                            {trait.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Text>
                          <Text>{Math.round(data.confidence * 100)}% confidence</Text>
                        </Flex>
                        <Text>{data.value}</Text>
                      </Box>
                    ))}
                  </VStack>
                  
                  <Button 
                    colorScheme="brand"
                    onClick={handleUpdatePersona}
                    mt={4}
                  >
                    Update Persona
                  </Button>
                </Box>
              </VStack>
            </TabPanel>
            
            {/* Settings Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                  <Heading as="h3" size="md" mb={4}>Profile Settings</Heading>
                  <FormControl mb={4}>
                    <FormLabel>Name</FormLabel>
                    <Input 
                      value={user?.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      value={user?.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Bio</FormLabel>
                    <Input 
                      value={user?.bio}
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                    />
                  </FormControl>
                  <Button colorScheme="brand">Save Changes</Button>
                </Box>
                
                <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                  <Heading as="h3" size="md" mb={4}>Password</Heading>
                  <FormControl mb={4}>
                    <FormLabel>Current Password</FormLabel>
                    <Input type="password" />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>New Password</FormLabel>
                    <Input type="password" />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input type="password" />
                  </FormControl>
                  <Button colorScheme="brand">Update Password</Button>
                </Box>
                
                <Box bg={bgColor} p={6} borderRadius="md" boxShadow="md">
                  <Heading as="h3" size="md" mb={4}>Danger Zone</Heading>
                  <Button colorScheme="red" variant="outline">Delete Account</Button>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
}
