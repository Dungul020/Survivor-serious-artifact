import express from 'express';
import { json, urlencoded } from 'express';
import { config } from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cors from './config/cors.js';
import { apiLimiter, surveyLimiter } from './config/ratelimit.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorhandler.js';

// Import routes in ES module style
import surveyRoutes from './routes/surveyroutes.js';
import feedbackRoutes from './routes/feedbackroutes.js';
import statsRoutes from './routes/statsroutes.js';
import analyticsRoutes from './routes/analyticsroutes.js';
import searchRoutes from './routes/searchroutes.js';

config();
const app = express();

// Connect to MongoDB
connectDB();

app.set('trust proxy', 1);


// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors); // make sure cors is a function, not an object
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

   
// Rate limiting
app.use('/api/', apiLimiter);
 
app.use('/api/surveys', surveyLimiter);

// Routes
app.use('/api/surveys', surveyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
import mongoose from 'mongoose';
['SIGTERM', 'SIGINT'].forEach(sig => {
  process.on(sig, async () => {
    console.log(`${sig} received. Shutting down gracefully...`);
    await mongoose.connection.close();
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
