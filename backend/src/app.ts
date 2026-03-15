import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRouter);

