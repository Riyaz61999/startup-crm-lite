import Lead from '../models/Lead.js';
import mongoose from 'mongoose';

/**
 * Enhanced getLeads with pagination, filtering, and sorting.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getLeads = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc', 
      status, 
      search, 
      source, 
      dateFrom, 
      dateTo 
    } = req.query;

    const query = { owner: req.user._id };

    if (status) query.status = status;
    if (source) query.source = source;
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex }
      ];
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip(skip).limit(parsedLimit),
      Lead.countDocuments(query)
    ]);

    const pages = Math.ceil(total / parsedLimit);

    res.json({
      leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parsedLimit,
        pages,
        hasNext: parseInt(page) < pages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};

/**
 * Complete getLeadStats aggregation.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getLeadStats = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const stats = await Lead.aggregate([
      { $match: { owner: ownerId } },
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                won: {
                  $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] }
                }
              }
            }
          ],
          statusStats: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          sourceStats: [
            {
              $group: {
                _id: '$source',
                count: { $sum: 1 }
              }
            }
          ],
          thisMonthStats: [
            {
              $match: {
                createdAt: { $gte: startOfThisMonth }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ],
          lastMonthStats: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0];
    const totalLeads = result.totalStats[0]?.total || 0;
    const wonLeads = result.totalStats[0]?.won || 0;
    
    let conversionRate = 0;
    if (totalLeads > 0) {
      conversionRate = parseFloat(((wonLeads / totalLeads) * 100).toFixed(1));
    }

    const statusBreakdown = {};
    result.statusStats.forEach(stat => {
      statusBreakdown[stat._id] = stat.count;
    });

    const sourceBreakdown = {};
    result.sourceStats.forEach(stat => {
      sourceBreakdown[stat._id] = stat.count;
    });

    const thisMonthLeads = result.thisMonthStats[0]?.count || 0;
    const lastMonthLeads = result.lastMonthStats[0]?.count || 0;

    let growthRate = 0;
    if (lastMonthLeads > 0) {
      growthRate = parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1));
    } else if (thisMonthLeads > 0) {
      growthRate = 100;
    }

    res.json({
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching lead stats', error: error.message });
  }
};

/**
 * Complete getMonthlyStats aggregation.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMonthlyStats = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    
    // Generate the last 6 months list starting from oldest
    const months = [];
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1, // 1-12
        label: monthStr
      });
      last6Months.push(monthStr);
    }

    const startOfPeriod = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const aggregation = await Lead.aggregate([
      { 
        $match: { 
          owner: ownerId,
          createdAt: { $gte: startOfPeriod }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } }
        }
      }
    ]);

    const statsMap = {};
    aggregation.forEach(stat => {
      const d = new Date(stat._id.year, stat._id.month - 1, 1);
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      statsMap[label] = stat;
    });

    const result = months.map(m => {
      const stat = statsMap[m.label];
      const total = stat ? stat.total : 0;
      const won = stat ? stat.won : 0;
      const lost = stat ? stat.lost : 0;
      const conversionRate = total > 0 ? parseFloat(((won / total) * 100).toFixed(1)) : 0;
      
      return {
        month: m.label,
        total,
        won,
        lost,
        conversionRate
      };
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly stats', error: error.message });
  }
};

/**
 * Search endpoint for autocomplete.
 * GET /api/leads/search?q=query&limit=5
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchLeads = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q) {
      return res.json([]);
    }

    const searchRegex = { $regex: q, $options: 'i' };
    const query = {
      owner: req.user._id,
      $or: [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex }
      ]
    };

    const parsedLimit = Math.min(parseInt(limit), 20); // Cap at 20

    const leads = await Lead.find(query)
      .select('_id name company email status')
      .limit(parsedLimit);

    res.json(leads);

  } catch (error) {
    res.status(500).json({ message: 'Error searching leads', error: error.message });
  }
};
