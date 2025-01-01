import { Request, Response } from "express";
import { Activity } from "../models/activityModel";
import { ActivityType } from "../types/activityType";
import { User } from "../models/userModel";

// Function to log any activity
export const logActivity = async (userId: string, type: ActivityType, details: any) => {
  const expirationPeriod = 40 * 24 * 60 * 60 * 1000; // 40 days
  const activity = new Activity({
    user: userId,
    type: type,
    ...details,
    expireAt: new Date(Date.now() + expirationPeriod),
  });
  await activity.save();
};

// Function to get all the activities of a user
export const getUserActivities = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const activities = await Activity.find({ user: userId })
    .populate('review list movie followed')
    .sort({ createdAt: -1 });
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};


// Function to get both user and following activities
export const getAllActivities = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const userActivities = await Activity.find({ user: userId })
    .populate('review list movie followed');
    const user = await User.findById(userId).populate('following');
    const followingIds = user.following.map((user: any) => user._id);
    const followingActivities = await Activity.find({ user: { $in: followingIds } })
    .populate('review list movie followed');
    const activities = userActivities.concat(followingActivities)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch all activities' });
  }
};