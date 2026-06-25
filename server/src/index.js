import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import weatherRoutes from "./routes/weatherRoutes.js";
import { connectDatabase } from "./services/searchStore.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (_, response) => {
  response.json({ ok: true });
});

app.use("/api", weatherRoutes);

app.use((error, _, response, __) => {
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    message: error.message || "Something went wrong"
  });
});

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
