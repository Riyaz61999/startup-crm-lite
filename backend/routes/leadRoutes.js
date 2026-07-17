import { Router } from 'express';
import { protect } from '../middleware/auth.js';

import { 
  getLeads, 
  getLeadStats, 
  getMonthlyStats, 
  searchLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead
} from '../controllers/leadController.js';

const router = Router();

// Apply auth middleware to all lead routes
router.use(protect);

// Lead analytics and search routes should be placed before /:id routes
router.get('/stats/summary', getLeadStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/search', searchLeads);

// Core lead routes
router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.patch('/:id/status', updateLeadStatus);
router.delete('/:id', deleteLead);

export default router;
