import express from "express";
import cors from "cors";
import { createLookupRoutes } from "./routes/lookup.routes";
import { TABLES } from "./services/constants";
import imageRoutes from "./routes/image.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "Clothing Store API is running!",
    });
});

// --- Dynamic Endpoints Get, GetById, Post, Put, Delete for all the tables
// --- that are defined in the Tables constant

Object.entries(TABLES).map(([_, value]) => {
    app.use(`/api/${value}`, createLookupRoutes(value));
})
app.use("/api/images", imageRoutes);

export default app;