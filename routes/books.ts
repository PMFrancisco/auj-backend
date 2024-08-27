import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const booksFilePath = path.join(__dirname, "../database/books.json");
const usersFilePath = path.join(__dirname, "../database/users.json");

// Helper functions
const readJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const writeJSONFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

let books = readJSONFile(booksFilePath);
let users = readJSONFile(usersFilePath);

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 */

router.get("/", (req: Request, res: Response) => {
  res.json(books);
});

/**
 * @swagger
 * /books/{id}/lend:
 *   post:
 *     summary: Lend a book to a user
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *     responses:
 *       200:
 *         description: The book has been lent out
 *       400:
 *         description: Book is already lent out or invalid request
 *       404:
 *         description: Book or user not found
 */

router.post("/:id/lend", (req: Request, res: Response) => {
  const { userId } = req.body;
  const { id } = req.params;

  // Find the book by ID
  const bookIndex = books.findIndex((b: any) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).send("Book not found");
  }

  const book = books[bookIndex];

  // Check if the book is already lent out
  if (book.lentTo) {
    return res.status(400).send("Book is already lent out");
  }

  // Check if the user exists
  const user = users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Lend the book to the user
  book.lentTo = userId;
  book.lentDate = new Date().toISOString(); // Record the date when the book was lent out

  // Update the books.json file
  writeJSONFile(booksFilePath, books);

  res.status(200).json({
    message: `Book "${book.title}" has been lent to ${user.name}`,
    book: book,
  });
});

/**
 * @swagger
 * /books/{id}/return:
 *   post:
 *     summary: Return a book by a user
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *     responses:
 *       200:
 *         description: The book has been returned
 *       400:
 *         description: Book is not currently lent out or invalid request
 *       403:
 *         description: User does not match the borrower
 *       404:
 *         description: Book not found
 */

router.post("/:id/return", (req: Request, res: Response) => {
  const { userId } = req.body;
  const { id } = req.params;

  // Find the book by ID
  const bookIndex = books.findIndex((b: any) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).send("Book not found");
  }

  const book = books[bookIndex];

  // Check if the book is currently lent out
  if (!book.lentTo) {
    return res.status(400).send("Book is not currently lent out");
  }

  // Check if the user is the one who borrowed the book
  if (book.lentTo !== userId) {
    return res.status(403).send("User does not match the borrower");
  }

  // Return the book
  book.lentTo = null;
  book.returnDate = new Date().toISOString(); // Record the date when the book was returned

  // Update the books.json file
  writeJSONFile(booksFilePath, books);

  res.status(200).json({
    message: `Book "${book.title}" has been returned by ${
      users.find((u: any) => u.id === userId)?.name
    }`,
    book: {
      id: book.id,
      title: book.title,
      lentTo: book.lentTo,
    },
  });
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The book details
 *       404:
 *         description: Book not found
 */

router.get("/:id", (req: Request, res: Response) => {
  const book = books.find((b: any) => b.id === req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *               isbn:
 *                 type: string
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: The newly created book
 *       400:
 *         description: Title and author are required
 */

router.post("/", (req: Request, res: Response) => {
  const { title, author, publishedDate, isbn, genre } = req.body;

  // Validate required fields
  if (!title || !author) {
    return res.status(400).send("Title and author are required");
  }

  // Generate a unique ID based on the current timestamp
  const newBook = {
    id: `book-${Date.now()}`, // Unique ID
    title,
    author,
    publishedDate: publishedDate || null, // Optional
    isbn: isbn || null, // Optional
    genre: genre || null, // Optional
    lentTo: null, // Not lent to anyone initially
    lentDate: null, // No lent date initially
  };

  // Add the new book to the list
  books.push(newBook);
  writeJSONFile(booksFilePath, books);

  // Respond with the new book
  res.status(201).json(newBook);
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *               isbn:
 *                 type: string
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated book details
 *       404:
 *         description: Book not found
 */

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, publishedDate, isbn, genre } = req.body;
  const bookIndex = books.findIndex((b: any) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).send("Book not found");
  }
  const updatedBook = {
    ...books[bookIndex],
    ...(title && { title }),
    ...(author && { author }),
    ...(publishedDate && { publishedDate }),
    ...(isbn && { isbn }),
    ...(genre && { genre }),
  };
  books[bookIndex] = updatedBook;
  writeJSONFile(booksFilePath, books);
  res.json(updatedBook);
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */

router.delete("/:id", (req: Request, res: Response) => {
  let books = readJSONFile(booksFilePath);
  books = books.filter((b: any) => b.id !== req.params.id);
  writeJSONFile(booksFilePath, books);
  res.status(204).send();
});

export default router;
