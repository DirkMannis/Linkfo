import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  Divider,
  List,
  ListItem,
  Flex,
  Image,
} from '@chakra-ui/react';
// Remove the CheckCircleIcon import if you don't have @chakra-ui/icons installed

export default function ImportLinktree() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handlePreview = async (e) => {
    e.preventDefault();
console.log('Starting preview for username:', username);
    
    if (!username) {
      toast({
        title: 'Username required',
        description: 'Please enter your Linktree username',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the API to get Linktree data
console.log('Sending request to API:', { username });

      const response = await fetch('/api/import/linktree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error fetching Linktree data');
      }
      
      setPreviewData(data.data);
    } catch (error) {
console.error('Preview error details:', error);
      console.error('Preview error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to preview Linktree data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      // In a real implementation, this would save the links to the database
      // For now, we'll just simulate a successful import
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Import successful',
        description: 'Your Linktree links have been imported',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Error',
        description: 'Failed to import Linktree data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1">Import from Linktree</Heading>
        <Text>
          Enter your Linktree username to import your links and profile information.
        </Text>
        
        <Box as="form" onSubmit={handlePreview}>
          <FormControl id="username" isRequired>
            <FormLabel>Linktree Username</FormLabel>
            <Flex>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourusername"
                mr={4}
              />
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
              >
                Preview
              </Button>
            </Flex>
          </FormControl>
        </Box>
        
        {previewData && (
          <Box borderWidth="1px" borderRadius="lg" p={6}>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Preview</Heading>
              
              <Flex align="center">
                <Image
                  src={previewData.profileImage}
                  alt={previewData.username}
                  boxSize="80px"
                  borderRadius="full"
                  mr={4}
                />
                <Box>
                  <Heading size="sm">{previewData.username}</Heading>
                  <Text>{previewData.bio}</Text>
                </Box>
              </Flex>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={3}>Links to Import ({previewData.links.length})</Heading>
                <List spacing={3}>
                  {previewData.links.map((link) => (
                    <ListItem key={link.id}>
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      <Text as="span" fontWeight="bold">{link.title}</Text>
                      <Text as="span" ml={2} color="gray.600">
                        {link.url}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
              
              <Button
                colorScheme="green"
                onClick={handleImport}
                isLoading={isImporting}
                size="lg"
              >
                Import {previewData.links.length} Links
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
