import  Analytics  from '../models/surveys.js';

export async function getAnalytics(req, res) {
  try {
    const { startDate, endDate, event } = req.query;
    const filter = {};

    if (startDate || endDate) filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
    if (event) filter.event = event;

    const analytics = await Analytics.find(filter).sort({ timestamp: -1 }).limit(1000);
    const summary = await Analytics.aggregate([{ $match: filter }, { $group: { _id: '$event', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);

    res.json({ success: true, data: { events: analytics, summary } });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
}
