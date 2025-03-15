require('dotenv').config();

// Import app from app.js
const app = require('./src/app');

// Set port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown for PM2
process.on('SIGINT', () => {
    console.log('Server is shutting down gracefully...');
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Server is shutting down gracefully...');
    process.exit();
});

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});