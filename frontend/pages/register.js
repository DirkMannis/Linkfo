import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Container,
  Flex,
  Image,
  VStack,
} from '@chakra-ui/react';
import { authService } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

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
      
      // Make sure token is stored in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Redirect to dashboard
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
    <Container maxW="container.xl" p={0}>
      <Flex h={{ base: 'auto', md: '100vh' }} py={[0, 10, 20]} direction={{ base: 'column-reverse', md: 'row' }}>
        <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start" bg="gray.50">
          <VStack spacing={3} alignItems="flex-start">
            <Heading size="2xl">Create your account</Heading>
            <Text>Join Linkfo to create your AI agent persona and manage your links.</Text>
          </VStack>

          <Box as="form" onSubmit={handleSubmit} w="full">
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  bg="white"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  bg="white"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  bg="white"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
              >
                Sign up
              </Button>
            </Stack>
          </Box>

          <Text>
            Already have an account?{' '}
            <Link href="/login" passHref>
              <Text as="span" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Sign in
              </Text>
            </Link>
          </Text>
        </VStack>

        <VStack w="full" h="full" p={10} spacing={10} alignItems="center" justifyContent="center" bg="blue.500">
          <Image 
            src="/logo.png" 
            alt="Linkfo Logo" 
            fallbackSrc="https://via.placeholder.com/150?text=Linkfo"
            boxSize="150px"
            objectFit="contain"
          />
          <Heading color="white" size="xl" textAlign="center">
            Linkfo
          </Heading>
          <Text color="white" fontSize="lg" textAlign="center">
            Your AI agent persona for online engagement
          </Text>
        </VStack>
      </Flex>
    </Container>
  ) ;
}
