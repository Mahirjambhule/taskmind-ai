const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- Import CORS
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- 1. CORS MIDDLEWARE (MUST BE AT THE TOP) ---
app.use(cors({
  origin: [
    "http://localhost:5173",                 // Trust Localhost
    "https://taskmind-ai-app.vercel.app"
  ],
  credentials: true,                         // Allow cookies/tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these actions
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 2. JSON PARSER ---
app.use(express.json());

// --- 3. ROUTES ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


