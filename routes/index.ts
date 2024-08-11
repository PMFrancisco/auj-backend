import express from 'express';
import userRoutes from './users';
import booksRoutes from './books';
import borrowRoutes from './borrow';

const router = express.Router();

router.use("/users", userRoutes);
router.use("/books", booksRoutes);
router.use("/borrow", borrowRoutes)

export default router;
