const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../../client')));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await new Promise((resolve, reject) => {
            http.listen(PORT, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
        } else {
            console.error('Failed to start server:', error);
        }
        process.exit(1);
    }
};

startServer();
