import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const usersFilePath = path.join(__dirname, "../database/users.json");

// Helper functions
const readJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const writeJSONFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

const users = readJSONFile(usersFilePath);

/**
 * @swagger
 * tags:
 *     name: Users
 *     description: User management API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   joinedDate:
 *                     type: string
 *                     format: date-time
 */

router.get("/", (req: Request, res: Response) => {
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 joinedDate:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 */

router.get("/:id", (req: Request, res: Response) => {
  const user = users.find((u: any) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
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
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: The newly created user
 *       400:
 *         description: Name and email are required or email already in use
 */
router.post("/", (req: Request, res: Response) => {
  const newUser = req.body;

  // Generate a unique ID based on the current timestamp
  newUser.id = `user-${Date.now()}`;

  // Set the joinedDate to the current date and time
  newUser.joinedDate = new Date().toISOString(); // ISO format date string

  // Validate required fields
  if (!newUser.name || !newUser.email) {
    return res.status(400).send("Name and email are required");
  }

  // Check for duplicate email
  const emailExists = users.some((u: any) => u.email === newUser.email);
  if (emailExists) {
    return res.status(400).send("Email already in use");
  }

  // Add new user
  users.push(newUser);
  writeJSONFile(usersFilePath, users);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user details
 *       400:
 *         description: At least one field (name or email) must be provided, or email already in use
 *       404:
 *         description: User not found
 */

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Basic validation
  if (!name && !email) {
    return res
      .status(400)
      .send("At least one field (name or email) must be provided for update");
  }

  // Find user index
  const userIndex = users.findIndex((u: any) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  // Check for duplicate email
  if (email) {
    const emailExists = users.some(
      (u: any) => u.email === email && u.id !== id,
    );
    if (emailExists) {
      return res.status(400).send("Email is already in use by another user");
    }
  }

  // Update user
  const updatedUser = {
    ...users[userIndex],
    ...(name && { name }), // Update name if provided
    ...(email && { email }), // Update email if provided
  };

  // Replace the old user with the updated user
  users[userIndex] = updatedUser;
  writeJSONFile(usersFilePath, users);

  // Respond with the updated user
  res.json(updatedUser);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */

router.delete("/:id", (req: Request, res: Response) => {
  let users = readJSONFile(usersFilePath);
  users = users.filter((u: any) => u.id !== req.params.id);
  writeJSONFile(usersFilePath, users);
  res.status(204).send();
});

export default router;
