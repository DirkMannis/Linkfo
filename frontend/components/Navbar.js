import { useState, useEffect } from 'react'; // Add useEffect
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  useColorModeValue,
  useDisclosure,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

const NavLink = ({ children, href }) => (
  <NextLink href={href} passHref legacyBehavior>
    <Link
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      {children}
    </Link>
  </NextLink>
);


export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated (moved to useEffect)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // Runs once on client-side mount

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} px={4} boxShadow="sm">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box fontWeight="bold" fontSize="xl" color="brand.500">
            <NextLink href="/" passHref legacyBehavior>
              <Link as="a" _hover={{ textDecoration: 'none' }}>
                Linkfo
              </Link>
            </NextLink>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink href="/">Home</NavLink>
            {isAuthenticated && <NavLink href="/dashboard">Dashboard</NavLink>}
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={4}>
            {isAuthenticated ? (
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={600}
                variant={'outline'}
                href={'/dashboard'}
                colorScheme="brand"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  as={'a'}
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                  href={'/login'}
                >
                  Sign In
                </Button>
                <Button
                  as={'a'}
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'brand.500'}
                  href={'/register'}
                  _hover={{
                    bg: 'brand.600',
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            <NavLink href="/">Home</NavLink>
            {isAuthenticated && <NavLink href="/dashboard">Dashboard</NavLink>}
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/import">Import</NavLink>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}