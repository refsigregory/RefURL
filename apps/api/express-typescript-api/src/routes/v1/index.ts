import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import urlRoutes from './url.routes';

const router = Router();

  router.use('/health', healthRoutes);
  router.use('/auth', authRoutes);
  router.use('/urls', urlRoutes);

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'API Express Typescript is working!',
    timestamp: new Date().toISOString(),
  });
});

export default router;
