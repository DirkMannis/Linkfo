import { useEffect, useState } from 'react';
import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Container, Spinner, Center, Flex, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
// Conditionally import icons to avoid client-side exceptions
let FiDownload;
if (typeof window !== 'undefined') {
  // Only import on client side
  import('react-icons/fi').then((module) => {
    FiDownload = module.FiDownload;
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    profileViews: 0,
    linkClicks: 0,
    chatInteractions: 0,
    topLinks: []
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    // Load stats
    const loadStats = async () => {
      try {
        // For now, use mock data instead of calling the API
        const data = {
          profileViews: 1245,
          linkClicks: 867,
          chatInteractions: 342,
          topLinks: [
            { id: '1', title: 'My Website', clicks: 423 },
            { id: '2', title: 'Twitter', clicks: 287 },
            { id: '3', title: 'YouTube', clicks: 157 }
          ]
        };
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1">Dashboard</Heading>
        <Button
          as="a"
          href="/import"
          colorScheme="blue"
          // Use a simpler approach without the icon
        >
          Import from Linktree
        </Button>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={10}>
        <Stat>
          <StatLabel>Profile Views</StatLabel>
          <StatNumber>{stats.profileViews}</StatNumber>
          <StatHelpText>Total views of your profile</StatHelpText>
        </Stat>
        
        <Stat>
          <StatLabel>Link Clicks</StatLabel>
          <StatNumber>{stats.linkClicks}</StatNumber>
          <StatHelpText>Total clicks on your links</StatHelpText>
        </Stat>
        
        <Stat>
          <StatLabel>Chat Interactions</StatLabel>
          <StatNumber>{stats.chatInteractions}</StatNumber>
          <StatHelpText>Total AI chat interactions</StatHelpText>
        </Stat>
      </SimpleGrid>
      
      <Box>
        <Heading as="h2" size="md" mb={4}>Top Performing Links</Heading>
        {stats.topLinks && stats.topLinks.map(link => (
          <Box key={link.id} p={4} mb={2} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold">{link.title}</Text>
            <Text>{link.clicks} clicks</Text>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
