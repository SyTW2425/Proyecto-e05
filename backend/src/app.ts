import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSwaggerDocs } from './config/swagger';

import { connectDB } from './config/db';
import userRouter from './routes/users';
import movieRouter from './routes/movies';
import reviewRouter from './routes/reviews';
import listRouter from './routes/lists';
import activityRouter from './routes/activities';
import tmdbRouter from './routes/tmdbRouter';


export const app = express();
app.use(express.json());

// Load env variables
dotenv.config();

// Avoids future problems between backend and frontend
app.use(cors())

// Connects to CineTrunk Database
connectDB();

// API documentation
setupSwaggerDocs(app);


// Routers
app.use('/api/users',  userRouter);
app.use('api/movies', movieRouter);
app.use('api/reviews', reviewRouter);
app.use('api/lists', listRouter);
app.use('api/activities', activityRouter);
app.use('/api/moviesdb', tmdbRouter);
