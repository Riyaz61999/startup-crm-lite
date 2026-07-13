import { Router } from 'express';

import { 
  getLeads, 
  getLeadStats, 
  getMonthlyStats, 
  searchLeads 
} from '../controllers/leadController.js';

const router = Router();

// Lead analytics and search routes should be placed before /:id routes
router.get('/stats', getLeadStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/search', searchLeads);

// Core lead routes
router.get('/', getLeads);

export default router;
