import express from 'express';
import dotenv from 'dotenv';
import serviceRouter from "./routes/serviceRoutes.js";
import ftthRouter from "./routes/ftthRoute.js";
import authRouter from './routes/authRoute.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import mailRouter from './routes/mailRoute.js';
import categoryRouter from './modules/category/category.route.js';
import productRouter from './modules/product/product.route.js';
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // if sending cookies or auth headers
}));
app.use(cookieParser());
app.use(express.json());
app.use("/service", serviceRouter);
app.use("/ftth", ftthRouter);
app.use('/auth', authRouter);
app.use('/mail', mailRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
