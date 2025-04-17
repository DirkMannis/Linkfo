require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // Parse JSON bodies

const uri = 'mongodb+srv://dirkmannis:Dirk!Mannis17@cluster0.ongkfgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
const jwtSecret = process.env.JWT_SECRET; // Access JWT_SECRET

let db; // Store the database instance

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('linkfo');

        // Insert test data (run this once)
        const collection = db.collection('linkfo1');
        const existingData = await collection.find({}).toArray();
        if (existingData.length === 0) {
            await collection.insertMany([
                { name: 'Item 1', description: 'This is item 1' },
                { name: 'Item 2', description: 'This is item 2' }
            ]);
            console.log('Test data inserted');
        }

        // Query data
        const data = await collection.find({}).toArray();
        console.log(data);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

connectToMongoDB();

// JWT utility function
const generateToken = (user) => {
    return jwt.sign(user, jwtSecret, { expiresIn: '1h' });
};

// Routes
app.get('/linkfo', async (req, res) => {
    try {
        const collection = db.collection('linkfo1');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Close MongoDB connection on app termination
process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});