import express, { Request, Response } from 'express';
import { List } from '../models/listModel';

export const listRouter = express.Router();

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Retrieve all lists
 *     description: Fetches all lists from the database.
 *     responses:
 *       200:
 *         description: A list of user-created movie lists.
 *       500:
 *         description: Server error
 */
listRouter.get('/', async (req: Request, res: Response) => {
  try {
    const lists = await List.find().populate('user movies');
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch lists' });
  }
});

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Create a new list
 *     description: Adds a new movie list to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - user
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the list
 *               description:
 *                 type: string
 *                 description: Description of the list
 *               user:
 *                 type: string
 *                 description: ID of the user who created the list
 *               movies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of movie IDs added to the list
 *     responses:
 *       201:
 *         description: List created successfully
 *       500:
 *         description: Server error
 */
listRouter.post('/', async (req: Request, res: Response) => {
  const { name, description, user, movies } = req.body;

  try {
    const newList = new List({ name, description, user, movies });
    await newList.save();
    res.status(201).json({
      message: 'List created successfully',
      list: newList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create list' });
  }
});

export default listRouter;