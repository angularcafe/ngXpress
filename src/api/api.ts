import { Request, Response, Router } from 'express';
import tasksRoute from './features/tasks/tasks.routes';

const router = Router();

router.use('/tasks', tasksRoute);

/**
 * Health check route
 * This route can be used to check if the API is running and healthy
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
  });
});

export default router;
