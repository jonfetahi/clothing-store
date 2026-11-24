import express from "express";
import cors from "cors";
import { createLookupRoutes } from "./routes/lookup.routes";
import { TABLES } from "./services/constants";
import favouritesRoutes from './routes/favourites.routes';
import shoppingCartRoutes from './routes/shopping-cart.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "Clothing Store API is running!",
    });
});

Object.entries(TABLES).map(([_, value]) => {
    app.use(`/api/${value}`, createLookupRoutes(value));
})
app.use("/api/favourites", favouritesRoutes);
app.use("/api/shopping-cart", shoppingCartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;