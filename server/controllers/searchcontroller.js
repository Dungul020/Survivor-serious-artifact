import Survey  from '../models/surveys.js';

export async function advancedSearch(req, res) {
  try {
    const { searchTerm, filters = {}, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.body;
    const pipeline = [{ $match: { status: 'completed' } }];

    if (searchTerm) {
      pipeline.push({
        $match: {
          $or: [
            { 'advice.adviceForOthers': { $regex: searchTerm, $options: 'i' } },
            { 'demographics.location': { $regex: searchTerm, $options: 'i' } },
            { 'drugHistory.primaryDrug': { $regex: searchTerm, $options: 'i' } }
          ]
        }
      });
    }

    if (filters.ageRange) pipeline.push({ $match: { 'demographics.age': { $gte: filters.ageRange[0], $lte: filters.ageRange[1] } } });
    if (filters.gender?.length) pipeline.push({ $match: { 'demographics.gender': { $in: filters.gender } } });
    if (filters.drugs?.length) pipeline.push({ $match: { 'drugHistory.primaryDrug': { $in: filters.drugs } } });
    if (filters.recoveryTimeRange) pipeline.push({ $match: { 'recoveryJourney.timeClean': { $gte: filters.recoveryTimeRange[0], $lte: filters.recoveryTimeRange[1] } } });

    const sortObj = {}; sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    pipeline.push({ $sort: sortObj });

    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: limit }, { $project: { ipAddress: 0, userAgent: 0, userId: 0 } });

    const results = await Survey.aggregate(pipeline);

    const countPipeline = [...pipeline]; countPipeline.pop(); countPipeline.pop(); countPipeline.pop();
    countPipeline.push({ $count: "total" });
    const total = (await Survey.aggregate(countPipeline))[0]?.total || 0;

    res.json({
      success: true,
      data: results,
      pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalRecords: total, hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 }
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
}
