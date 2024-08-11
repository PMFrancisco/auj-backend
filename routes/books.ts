import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const booksFilePath = path.join(__dirname, "../database/books.json");

// Helper functions
const readJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const writeJSONFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

const books = readJSONFile(booksFilePath);

// Get all books
router.get("/", (req: Request, res: Response) => {
  res.json(books);
});

// Get book by ID
router.get("/:id", (req: Request, res: Response) => {
  const book = books.find((b: any) => b.id === req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
});

// Create a new book
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
  };

  // Read the existing books
  const books = readJSONFile(booksFilePath);

  // Add the new book to the list
  books.push(newBook);
  writeJSONFile(booksFilePath, books);

  // Respond with the new book
  res.status(201).json(newBook);
});

// Update book by ID
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

// Delete book by ID
router.delete("/:id", (req: Request, res: Response) => {
  let books = readJSONFile(booksFilePath);
  books = books.filter((b: any) => b.id !== req.params.id);
  writeJSONFile(booksFilePath, books);
  res.status(204).send();
});

export default router;
