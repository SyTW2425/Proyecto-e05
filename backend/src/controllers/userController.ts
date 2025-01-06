import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import { ActivityType } from '../types/activityType';
import { logActivity } from './activityController';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure JWT_SECRET is defined

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, password, email } = req.body;

    // Check if the username or email is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'Username or email already exists' });
      return; // Return early to avoid further execution
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      email,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error registering user', error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Find if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid username' });
      return; // Return early to avoid further execution
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Incorrect password' });
      return; // Return early to avoid further execution
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

export const followUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, followId } = req.body;
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (!followUser) {
      res.status(404).json({ message: 'User to follow not found' });
      return;
    }
    if (user.following.includes(followId)) {
      res.status(400).json({ message: 'User already followed' });
      return;
    }
    if (userId === followId) {
      res.status(400).json({ message: 'Cannot follow yourself' });
      return;
    }
    user.following.push(followId);
    followUser.followers.push(userId);
    await user.save();
    await followUser.save();
    await logActivity(userId.toString(), ActivityType.FOLLOW, {
      followed: followId,
    });
    res.status(200).json({ message: 'User followed successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error following user', error: err.message });
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, unfollowId } = req.body;
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (!unfollowUser) {
      res.status(404).json({ message: 'User to unfollow not found' });
      return;
    }
    user.following = user.following.filter(
      (id) => id.toString() !== unfollowId.toString(),
    );
    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId.toString(),
    );
    await user.save();
    await unfollowUser.save();
    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error unfollowing user', error: err.message });
  }
};

export const getFollowers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const followers = await User.find({ _id: { $in: user.followers } });
    res.status(200).json(followers);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching followers', error: err.message });
  }
};

export const getFollowing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const following = await User.find({ _id: { $in: user.following } });
    res.status(200).json(following);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching following', error: err.message });
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('-password -email')
      .populate('followers following');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching user info', error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};
