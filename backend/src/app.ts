import express from "express";
import cors from "cors";
import { createLookupRoutes } from "./routes/lookup.routes";
import { TABLES } from "./services/constants";
import imageRoutes from "./routes/image.routes";
import favouritesRoutes from './routes/favourites.routes';
import shoppingCartRoutes from './routes/shopping-cart.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "Clothing Store API is running!",
    });
});

Object.entries(TABLES).map(([_, value]) => {
    app.use(`/api/${value}`, createLookupRoutes(value));
})
app.use("/api/images", imageRoutes);
app.use("/api/favourites", favouritesRoutes);
app.use("/api/shopping-cart", shoppingCartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;