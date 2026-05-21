import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRouter); 
export default app;