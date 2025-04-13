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
  Image,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaInstagram, FaYoutube, FaGlobe, FaArrowRight } from 'react-icons/fa';
import Layout from '../components/Layout';
import ChatWidget from '../components/ChatWidget';

export default function Home({ isAuthenticated }) {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const [showChat, setShowChat] = useState(false);
  
  // Sample user data (would come from API in real implementation)
  const user = {
    name: 'Alex Johnson',
    bio: 'AI researcher and technology enthusiast',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    links: [
      {
        id: '1',
        title: 'My Website',
        url: 'https://alexjohnson.com',
        icon: 'FaGlobe',
        color: '#0080FF'
      },
      {
        id: '2',
        title: 'Twitter',
        url: 'https://twitter.com/alexjohnson',
        icon: 'FaTwitter',
        color: '#1DA1F2'
      },
      {
        id: '3',
        title: 'YouTube Channel',
        url: 'https://youtube.com/alexjohnson',
        icon: 'FaYoutube',
        color: '#FF0000'
      },
      {
        id: '4',
        title: 'My Latest Article',
        url: 'https://medium.com/@alexjohnson/latest',
        icon: 'FaMedium',
        color: '#00AB6C'
      }
    ]
  };
  
  // Function to render the correct icon
  const renderIcon = (iconName)  => {
    switch (iconName) {
      case 'FaTwitter':
        return <FaTwitter />;
      case 'FaInstagram':
        return <FaInstagram />;
      case 'FaYoutube':
        return <FaYoutube />;
      case 'FaGlobe':
      default:
        return <FaGlobe />;
    }
  };
  
  return (
    <Layout>
      <Container maxW="container.md" py={10}>
        {/* Profile Section */}
        <VStack spacing={6} align="center" mb={10}>
          <Image
            src={user.profileImage}
            alt={user.name}
            borderRadius="full"
            boxSize="150px"
            objectFit="cover"
            border="4px solid"
            borderColor="brand.500"
          />
          <Heading as="h1" size="xl">{user.name}</Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">{user.bio}</Text>
          
          {isAuthenticated && (
            <Button 
              rightIcon={<FaArrowRight />} 
              onClick={() => router.push('/dashboard')}
              variant="outline"
            >
              Go to Dashboard
            </Button>
          )}
        </VStack>
        
        {/* Links Section */}
        <VStack spacing={4} mb={10}>
          {user.links.map((link) => (
            <Link 
              key={link.id}
              href={link.url}
              isExternal
              w="100%"
              _hover={{ textDecoration: 'none' }}
            >
              <Box
                p={4}
                bg={bgColor}
                borderRadius="md"
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
                borderLeft="4px solid"
                borderColor={link.color}
              >
                <HStack spacing={4}>
                  <Box color={link.color}>
                    {renderIcon(link.icon)}
                  </Box>
                  <Text fontWeight="medium">{link.title}</Text>
                </HStack>
              </Box>
            </Link>
          ))}
        </VStack>
        
        {/* Chat Widget Toggle */}
        <Flex justify="center">
          <Button
            onClick={() => setShowChat(!showChat)}
            colorScheme="brand"
            size="lg"
            borderRadius="full"
            px={8}
          >
            {showChat ? 'Close Chat' : 'Chat with my AI Agent'}
          </Button>
        </Flex>
        
        {/* Chat Widget */}
        {showChat && (
          <Box mt={8}>
            <ChatWidget userName={user.name} />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
