import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { sellerApisRouter } from './routes/seller/apis';
import { marketplaceRouter } from './routes/marketplace';
import { consumerRouter } from './routes/consumer';
import './config/env';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/seller/apis', sellerApisRouter);
app.use('/marketplace', marketplaceRouter);
app.use('/consumer', consumerRouter);
