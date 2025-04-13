// frontend/pages/import.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import LinktreeImport from '../components/LinktreeImport';

export default function ImportPage({ isAuthenticated }) {
  const router = useRouter();
  const toast = useToast();
  
  const handleImportComplete = () => {
    toast({
      title: 'Import Complete',
      description: 'Your profile has been imported successfully. Redirecting to dashboard...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Redirect to dashboard after successful import
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };
  
  return (
    <Layout>
      <Container maxW="container.md" py={10}>
        <Heading as="h1" size="xl" mb={6}>Import Your Profile</Heading>
        <Text mb={8}>
          Import your existing profile and links from other platforms to get started quickly with Linkfo.
        </Text>
        
        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab>Linktree</Tab>
            <Tab>Beacons.ai</Tab>
            <Tab>Manual Import</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <LinktreeImport onImportComplete={handleImportComplete} />
            </TabPanel>
            <TabPanel>
              <Box p={6} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={4}>Import from Beacons.ai</Heading>
                <Text>Coming soon! This feature is under development.</Text>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={6} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={4}>Manual Import</Heading>
                <Text>Coming soon! This feature is under development.</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
}
