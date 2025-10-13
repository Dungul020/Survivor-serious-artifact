import models from '../models/surveys.js';
const { Survey } = models; 


export async function getStats(req, res) {
  try {
    const startTime = Date.now();

    const [
      totalSurveys,
      ageStats,
      drugStats,
      recoveryStats,
      successFactors,
      mentalHealthStats,
      qualityOfLifeStats,
      monthlyTrends
    ] = await Promise.all([
      Survey.countDocuments({ status: 'completed' }),
      Survey.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: ['$demographics.age', 25] }, then: '18-24' },
                  { case: { $lt: ['$demographics.age', 35] }, then: '25-34' },
                  { case: { $lt: ['$demographics.age', 45] }, then: '35-44' },
                  { case: { $lt: ['$demographics.age', 55] }, then: '45-54' },
                ],
                default: '55+'
              }
            },
            count: { $sum: 1 },
            averageCleanTime: { $avg: '$recoveryJourney.timeClean' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Survey.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$drugHistory.primaryDrug', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Survey.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: ['$recoveryJourney.timeClean', 6] }, then: '0-6 months' },
                  { case: { $lt: ['$recoveryJourney.timeClean', 12] }, then: '6-12 months' },
                  { case: { $lt: ['$recoveryJourney.timeClean', 24] }, then: '1-2 years' },
                  { case: { $lt: ['$recoveryJourney.timeClean', 60] }, then: '2-5 years' },
                ],
                default: '5+ years'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]),
      Survey.aggregate([
        { $match: { status: 'completed' } },
        { $unwind: '$recoveryJourney.successFactors' },
        { $group: { _id: '$recoveryJourney.successFactors', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Survey.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: null,
            hadTherapy: { $sum: { $cond: ['$mentalHealth.hadTherapy', 1, 0] } },
            hadMedication: { $sum: { $cond: ['$mentalHealth.hadMedication', 1, 0] } },
            totalResponses: { $sum: 1 }
          }
        }
      ]),
      Survey.aggregate([
        { $match: { status: 'completed', 'qualityOfLife.overallSatisfaction': { $exists: true } } },
        {
          $group: {
            _id: null,
            avgOverallSatisfaction: { $avg: '$qualityOfLife.overallSatisfaction' },
            avgPhysicalHealth: { $avg: '$qualityOfLife.physicalHealth' },
            avgMentalHealth: { $avg: '$qualityOfLife.mentalHealth' },
            avgRelationships: { $avg: '$qualityOfLife.relationships' },
            avgFinancialStability: { $avg: '$qualityOfLife.financialStability' }
          }
        }
      ]),
      Survey.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ])
    ]);

    const successRate = await Survey.countDocuments({ status: 'completed', 'recoveryJourney.timeClean': { $gte: 6 } });
    const averageRecoveryTime = await Survey.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, avg: { $avg: '$recoveryJourney.timeClean' } } }]);
    const queryTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        overview: {
          totalSurveys,
          successRate: Math.round((successRate / totalSurveys) * 100),
          averageRecoveryTime: Math.round(averageRecoveryTime[0]?.avg || 0),
          queryTime: `${queryTime}ms`
        },
        demographics: { ageDistribution: ageStats, drugDistribution: drugStats, recoveryTimeDistribution: recoveryStats },
        insights: { topSuccessFactors: successFactors, mentalHealthStats: mentalHealthStats[0] || {}, qualityOfLife: qualityOfLifeStats[0] || {} },
        trends: { monthlySubmissions: monthlyTrends }
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, message: 'Error fetching statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}
