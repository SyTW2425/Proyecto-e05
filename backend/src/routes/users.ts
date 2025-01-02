import express, { Request, Response } from 'express';
import { User } from '../models/userModel';
import { login,
         register,
         followUser,
         unfollowUser,
         getFollowers,
         getFollowing,
         getUserInfo, 
         searchUsers} from '../controllers/userController';

export const userRouter = express.Router();

/**
 * @swagger
 */
// Route to log user
userRouter.post('/login', login);

/**
 * @swagger
 */
// Route to create a new user
userRouter.post('/register', register);

userRouter.put('/profile-picture', async (req: Request, res: Response) => {
  const { profilePicture } = req.body;

  try {
    const userId = req.body.userId;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true },
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

userRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

userRouter.put('/follow', followUser);

userRouter.put('/unfollow', unfollowUser);

userRouter.get('/followers/:userId', getFollowers);

userRouter.get('/following/:userId', getFollowing);

userRouter.get('/info/:userId', getUserInfo);

userRouter.get('/user/:username', searchUsers);

export default userRouter;
