import express, { Request, Response } from 'express';
import { Activity, ActivityType } from '../models/activityModel';


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



export default activityRouter;