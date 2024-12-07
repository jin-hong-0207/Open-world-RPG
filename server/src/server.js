const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const GameServer = require('./gameServer');

const puzzleRoutes = require('./routes/puzzleRoutes');
const characterRoutes = require('./routes/characterRoutes');
const worldRoutes = require('./routes/worldRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize game server
const gameServer = new GameServer(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', puzzleRoutes);
app.use('/api', characterRoutes);
app.use('/api', worldRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
