// frontend/components/LinktreeImport.js

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Heading,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Image,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { FaFileImport, FaEye, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const LinktreeImport = ({ onImportComplete }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();
  
  const handlePreview = async () => {
    if (!username) {
      setError('Please enter a Linktree username');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/import/linktree/preview/${username}`);
      setPreviewData(response.data.profile);
    } catch (err) {
      console.error('Error previewing Linktree profile:', err);
      setError(err.response?.data?.message || 'Failed to preview Linktree profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleImport = async () => {
    if (!username) {
      setError('Please enter a Linktree username');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/import/linktree', { username });
      
      toast({
        title: 'Import Successful',
        description: 'Your Linktree profile has been imported successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      if (onImportComplete) {
        onImportComplete(response.data.profile);
      }
    } catch (err) {
      console.error('Error importing Linktree profile:', err);
      setError(err.response?.data?.message || 'Failed to import Linktree profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box p={6} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>Import from Linktree</Heading>
          <Text mb={4}>
            Enter your Linktree username to import your profile and links.
          </Text>
          
          <HStack mb={4}>
            <FormControl isRequired>
              <FormLabel>Linktree Username</FormLabel>
              <Input
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
          </HStack>
          
          <HStack>
            <Button
              leftIcon={<FaEye />}
              onClick={handlePreview}
              isLoading={loading}
              loadingText="Previewing..."
            >
              Preview
            </Button>
            <Button
              leftIcon={<FaFileImport />}
              colorScheme="brand"
              onClick={handleImport}
              isLoading={loading}
              loadingText="Importing..."
              isDisabled={!previewData}
            >
              Import
            </Button>
          </HStack>
          
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Box>
        
        {loading && (
          <Box textAlign="center" p={4}>
            <Spinner size="xl" />
            <Text mt={2}>Processing your Linktree profile...</Text>
          </Box>
        )}
        
        {previewData && !loading && (
          <Box p={6} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Preview</Heading>
            
            <VStack spacing={4} align="stretch">
              <HStack>
                {previewData.profile_image && (
                  <Image
                    src={previewData.profile_image}
                    alt={previewData.name || previewData.username}
                    borderRadius="full"
                    boxSize="100px"
                  />
                )}
                <VStack align="start" spacing={1}>
                  <Heading size="md">{previewData.name || previewData.username}</Heading>
                  {previewData.bio && <Text>{previewData.bio}</Text>}
                  <Badge colorScheme="green">Linktree Import</Badge>
                </VStack>
              </HStack>
              
              <Divider />
              
              <Heading size="sm" mb={2}>Links ({previewData.links?.length || 0})</Heading>
              
              <SimpleGrid columns={1} spacing={4}>
                {previewData.links?.map((link, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderLeftWidth="4px"
                    borderLeftColor={link.color || 'brand.500'}
                  >
                    <Text fontWeight="bold">{link.title}</Text>
                    <Text fontSize="sm" color="gray.500">{link.url}</Text>
                  </Box>
                ))}
              </SimpleGrid>
              
              <Button
                leftIcon={<FaCheck />}
                colorScheme="brand"
                onClick={handleImport}
                isLoading={loading}
                loadingText="Importing..."
                size="lg"
                mt={2}
              >
                Confirm Import
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default LinktreeImport;
