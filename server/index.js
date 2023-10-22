import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import SeedRoutes from "./controllers/seed.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api", SeedRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
