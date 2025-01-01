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
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                   lists:
 *                     type: array
 *                     items:
 *                       type: string
 *                   following:
 *                     type: array
 *                     items:
 *                       type: string
 *                   followers:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Failed to fetch users.
 */
// Route to get all users
userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: Jane Doe
 *               username:
 *                 type: string
 *                 description: Unique username for the user.
 *                 example: janedoe123
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: password123
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: janedoe@example.com
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of review IDs associated with the user.
 *               lists:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of list IDs associated with the user.
 *               following:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs the user is following.
 *               followers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs who follow the user.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                     lists:
 *                       type: array
 *                       items:
 *                         type: string
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Failed to create user.
 */
// Route to create a new user
userRouter.post('/', async (req: Request, res: Response) => {
  const {
    name,
    username,
    password,
    email,
    reviews,
    lists,
    following,
    followers,
  } = req.body;

  try {
    const newUser = new User({
      name,
      username,
      password,
      email,
      reviews,
      lists,
      following,
      followers,
    });

    await newUser.save();
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

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
