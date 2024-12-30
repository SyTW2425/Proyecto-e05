import express, { Request, Response } from 'express';
import { Activity } from '../models/activityModel';
import { ActivityType } from '../types/activityType';
import { getUserActivities,
         getFollowingActivities,
         getAllActivities,
       } from '../controllers/activityController';

export const activityRouter = express.Router();

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Retrieve all activities
 *     description: Fetches all activities from the database.
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: A list of activities.
 *       500:
 *         description: Server error
 */
activityRouter.get('/', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('user review list movie');
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
});

activityRouter.get('/user/:userId', getUserActivities);

activityRouter.get('/following/:userId', getFollowingActivities);

activityRouter.get('/all/:userId', getAllActivities);

export default activityRouter;
