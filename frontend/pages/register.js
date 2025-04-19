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
  Stack,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import { authService } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

// In register.js, update the handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    console.log('Submitting registration form:', { name, email, password: '***' });
    
    const response = await authService.register(name, email, password);
    console.log('Registration response:', response);
    
    toast({
      title: 'Account created.',
      description: "We've created your account for you.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    router.push('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      data: error.response?.data
    });
    
    toast({
      title: 'An error occurred.',
      description: error.response?.data?.message || 'Unable to create account.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <Layout>
      <Container maxW="container.md" py={10}>
        <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
          <Heading mb={6}>Create an Account</Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
              >
                Sign up
              </Button>
            </Stack>
          </form>
          <Text mt={6}>
            Already have an account?{' '}
            <NextLink href="/login" passHref>
              <Link color="brand.500">Sign in</Link>
            </NextLink>
          </Text>
        </Box>
      </Container>
    </Layout>
  );
}
