const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const PORT = process.env.PORT || 5000;

// Create an HTTP server (needed for Socket.IO)
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Pass Socket.IO instance to routes
const eventRoutes = require('./src/routes/event')(io);
app.use('/api/events', eventRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
