import { Request, Response } from "express"; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../models/userModel";

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
    const newUser = new User({ name, username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
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
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};