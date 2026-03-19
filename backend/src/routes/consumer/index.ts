import { Router } from 'express';
import { consumerSubscriptionsRouter } from './subscriptions';
import { consumerApiKeysRouter } from './apiKeys';

export const consumerRouter = Router();

consumerRouter.use(consumerSubscriptionsRouter);
consumerRouter.use(consumerApiKeysRouter);
