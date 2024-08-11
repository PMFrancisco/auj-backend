import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const usersFilePath = path.join(__dirname, '../database/users.json');

// Helper functions
const readJSONFile = (filePath: string) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSONFile = (filePath: string, data: any) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Get all users
router.get('/', (req: Request, res: Response) => {
    const users = readJSONFile(usersFilePath);
    res.json(users);
});

// Get user by ID
router.get('/:id', (req: Request, res: Response) => {
    const users = readJSONFile(usersFilePath);
    const user = users.find((u: any) => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// Create new user
router.post('/', (req: Request, res: Response) => {
    const newUser = req.body;

    // Generate a unique ID based on the current timestamp
    newUser.id = `user-${Date.now()}`;
    
    // Set the joinedDate to the current date and time
    newUser.joinedDate = new Date().toISOString(); // ISO format date string

    // Validate required fields
    if (!newUser.name || !newUser.email) {
        return res.status(400).send('Name and email are required');
    }

    // Read current users
    const users = readJSONFile(usersFilePath);

    // Check for duplicate email
    const emailExists = users.some((u: any) => u.email === newUser.email);
    if (emailExists) {
        return res.status(400).send('Email already in use');
    }

    // Add new user
    users.push(newUser);
    writeJSONFile(usersFilePath, users);
    res.status(201).json(newUser);
});

// Update user by ID
router.put('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Basic validation
    if (!name && !email) {
        return res.status(400).send('At least one field (name or email) must be provided for update');
    }

    // Read current users
    const users = readJSONFile(usersFilePath);

    // Find user index
    const userIndex = users.findIndex((u: any) => u.id === id);
    if (userIndex === -1) {
        return res.status(404).send('User not found');
    }

    // Check for duplicate email
    if (email) {
        const emailExists = users.some((u: any) => u.email === email && u.id !== id);
        if (emailExists) {
            return res.status(400).send('Email is already in use by another user');
        }
    }

    // Update user
    const updatedUser = {
        ...users[userIndex],
        ...(name && { name }), // Update name if provided
        ...(email && { email }) // Update email if provided
    };

    // Replace the old user with the updated user
    users[userIndex] = updatedUser;
    writeJSONFile(usersFilePath, users);

    // Respond with the updated user
    res.json(updatedUser);
});

// Delete user by ID
router.delete('/:id', (req: Request, res: Response) => {
    let users = readJSONFile(usersFilePath);
    users = users.filter((u: any) => u.id !== req.params.id);
    writeJSONFile(usersFilePath, users);
    res.status(204).send();
});

export default router;
