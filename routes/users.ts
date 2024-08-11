import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const usersFilePath = path.join(__dirname, "../database/users.json");

// Helper functions
const readJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

let users = readJSONFile(usersFilePath);

const writeJSONFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Get all users
router.get("/", (req: Request, res: Response) => {
  res.json(users);
});

// Get user by ID
router.get("/:id", (req: Request, res: Response) => {
  const user = users.find((u: any) => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Create new user
router.post("/", (req: Request, res: Response) => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).send("Missing required fields");
  }

  // Read the current users
  const users = readJSONFile(usersFilePath);

  // Check for duplicate email
  const existingUser = users.find((u: any) => u.email === email);
  if (existingUser) {
    return res.status(400).send("Email already exists");
  }

  // Generate a unique ID based on the current timestamp
  const generateUniqueId = (): string => {
    return `user-${Date.now()}`;
  };

  // Create a new user with a unique ID
  const newUser = {
    id: generateUniqueId(), // Use timestamp-based unique ID
    name,
    email,
    joinedDate: new Date().toISOString(),
  };

  // Add the new user to the list and save to file
  users.push(newUser);
  writeJSONFile(usersFilePath, users);

  // Respond with the newly created user
  res.status(201).json(newUser);
});

// Update user
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Basic validation
  if (!name && !email) {
    return res
      .status(400)
      .send("At least one field (name or email) must be provided for update");
  }

  // Find the user to update
  const userIndex = users.findIndex((u: any) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  // Check for duplicate email
  if (email) {
    const emailExists = users.some(
      (u: any) => u.email === email && u.id !== id
    );
    if (emailExists) {
      return res.status(400).send("Email is already in use by another user");
    }
  }

  // Update the user
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

export default router;
