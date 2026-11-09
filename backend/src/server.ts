import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

startServer();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});