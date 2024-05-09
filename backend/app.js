import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import serverRouter from './routes/serverRoute.js';
import Error from './middleware/Error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: 'backend/config/config.env' });
}
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(Error);

app.use('/api', userRouter);
app.use('/', serverRouter);
export default app;
