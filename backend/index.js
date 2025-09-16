import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser'; //
// import morgan from 'morgan'; //
import path from 'path'; //
import { fileURLToPath } from 'url'; //
import { dirname } from 'path'; //
import { connectDB } from './config/db.js'; //
import { errorHandler } from './middleware/errorMiddleware.js'; //
import notFound from './middleware/notFoundMiddleware.js'; //

import userRoutes from './routes/userRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import reviewRoutes from './routes/reviewsRoutes.js';
import bookingRoutes from './routes/bookingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js'//

const __filename = fileURLToPath(import.meta.url); //
const __dirname = dirname(__filename); //

config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: ['https://travel-world-chi.vercel.app'], // ['http://localhost:5173', 'http://localhost:3000'] ['https://travel-world-chi.vercel.app']
  credentials: true,
};

// connectDB(); //
mongoose.set('strictQuery', false);
app.set('trust proxy', 1);
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use(cors(corsOptions));
// app.use(morgan('dev')); //
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/payments', paymentRoutes)//

// Keep static files for now (you can remove later)
app.use(express.static(path.join(__dirname, 'public/images/'))); //
// app.get('*', (req, res) => {
//   //
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html')); //
// });
app.use(notFound); //
app.use(errorHandler); //

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

connectDB().then(() => {
  //
  app.listen(PORT, () => {
    //
    console.log(`Server running on port ${PORT}`); //
  });
}); //

// mongoose.connection.once('open', () => {
//   //
//   console.log('Connected to MongoDB'); //
// }); //

// mongoose.connection.on('error', (err) => {
//   //
//   console.log(err); //
// }); //
