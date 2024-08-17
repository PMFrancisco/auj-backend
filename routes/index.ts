import express from 'express';
import userRoutes from './users';
import booksRoutes from './books';

const router = express.Router();

router.use("/users", userRoutes);
router.use("/books", booksRoutes);

export default router;
