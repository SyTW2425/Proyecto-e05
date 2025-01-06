import express, { Request, Response } from 'express';
import { getUserActivities, getAllActivities } from '../controllers/activityController';

export const activityRouter = express.Router();

activityRouter.get('/user/:userId', getUserActivities);

activityRouter.get('/all/:userId', getAllActivities);

export default activityRouter;
