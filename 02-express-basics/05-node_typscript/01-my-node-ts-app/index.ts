// index.ts
import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple GET route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

// Example API route
app.get("/api/greet", (req: Request, res: Response) => {
  res.json({ message: "Welcome to your API!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
