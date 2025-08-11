import express from 'express';
import dotenv from 'dotenv';
import serviceRouter from "./routes/serviceRoutes.js";
import ftthRouter from "./routes/ftthRoute.js";
import authRouter from './routes/authRoute.js';
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use("/service", serviceRouter);
app.use("/ftth", ftthRouter);
app.use('/auth', authRouter);
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
