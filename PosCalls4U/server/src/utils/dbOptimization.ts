import mongoose, { Model, Document, Aggregate } from 'mongoose';
import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Index definitions for different collections
export const IndexDefinitions = {
  users: [
    { keys: { email: 1 }, options: { unique: true, name: 'email_unique' } },
    { keys: { 'profile.phone': 1 }, options: { sparse: true, name: 'phone_sparse' } },
    { keys: { role: 1, active: 1 }, options: { name: 'role_active' } },
    { keys: { createdAt: 1 }, options: { name: 'created_at' } },
    { keys: { lastLogin: -1 }, options: { name: 'last_login_desc' } },
    { keys: { 'team.id': 1 }, options: { sparse: true, name: 'team_id' } },
  ],
  
  calls: [
    { keys: { userId: 1, startTime: -1 }, options: { name: 'user_start_time' } },
    { keys: { status: 1 }, options: { name: 'status' } },
    { keys: { endTime: -1 }, options: { name: 'end_time_desc' } },
    { keys: { 'customer.phone': 1 }, options: { name: 'customer_phone' } },
    { keys: { teamId: 1, startTime: -1 }, options: { name: 'team_start_time' } },
    { keys: { duration: -1 }, options: { name: 'duration_desc' } },
    { keys: { outcome: 1 }, options: { name: 'outcome' } },
    { keys: { createdAt: 1 }, options: { expireAfterSeconds: 31536000, name: 'ttl_created' } }, // 1 year TTL
  ],
  
  dvpStats: [
    { keys: { userId: 1, date: -1 }, options: { unique: true, name: 'user_date_unique' } },
    { keys: { teamId: 1, date: -1 }, options: { name: 'team_date' } },
    { keys: { date: -1 }, options: { name: 'date_desc' } },
    { keys: { 'metrics.callsHandled': -1 }, options: { name: 'calls_handled_desc' } },
    { keys: { 'metrics.avgTalkTime': -1 }, options: { name: 'avg_talk_time_desc' } },
  ],
  
  fixtures: [
    { keys: { league: 1, season: 1, date: -1 }, options: { name: 'league_season_date' } },
    { keys: { status: 1 }, options: { name: 'status' } },
    { keys: { date: -1 }, options: { name: 'date_desc' } },
    { keys: { 'teams.home': 1, 'teams.away': 1 }, options: { name: 'teams' } },
    { keys: { 'odds.updated': -1 }, options: { sparse: true, name: 'odds_updated' } },
  ],
  
  teams: [
    { keys: { name: 1 }, options: { unique: true, name: 'name_unique' } },
    { keys: { active: 1 }, options: { name: 'active' } },
    { keys: { 'members.userId': 1 }, options: { name: 'member_user_id' } },
    { keys: { createdAt: 1 }, options: { name: 'created_at' } },
  ],
  
  sessions: [
    { keys: { userId: 1 }, options: { name: 'user_id' } },
    { keys: { token: 1 }, options: { unique: true, name: 'token_unique' } },
    { keys: { expiresAt: 1 }, options: { expireAfterSeconds: 0, name: 'ttl_expires' } },
    { keys: { createdAt: 1 }, options: { name: 'created_at' } },
  ],
};

// Query optimization utilities
export class QueryOptimizer {
  /**
   * Create optimized indexes for a collection
   */
  static async createIndexes(model: Model<any>, collectionName: keyof typeof IndexDefinitions): Promise<void> {
    try {
      const indexes = IndexDefinitions[collectionName] || [];
      
      for (const index of indexes) {
        try {
          await model.collection.createIndex(index.keys, index.options);
          logger.info(`Created index ${index.options.name} for ${collectionName}`);
        } catch (error: any) {
          if (error.code === 11000 || error.codeName === 'IndexOptionsConflict') {
            logger.warn(`Index ${index.options.name} already exists for ${collectionName}`);
          } else {
            logger.error(`Failed to create index ${index.options.name} for ${collectionName}:`, error);
          }
        }
      }
    } catch (error) {
      logger.error(`Failed to create indexes for ${collectionName}:`, error);
    }
  }

  /**
   * Drop unused indexes
   */
  static async dropUnusedIndexes(model: Model<any>): Promise<void> {
    try {
      const stats = await model.collection.stats();
      const indexes = await model.collection.listIndexes().toArray();
      
      for (const index of indexes) {
        if (index.name === '_id_') continue; // Skip the default _id index
        
        const indexStats = await model.collection.aggregate([
          { $indexStats: {} },
          { $match: { name: index.name } }
        ]).toArray();

        if (indexStats.length > 0 && indexStats[0].accesses?.ops === 0) {
          await model.collection.dropIndex(index.name);
          logger.info(`Dropped unused index: ${index.name}`);
        }
      }
    } catch (error) {
      logger.error('Failed to drop unused indexes:', error);
    }
  }

  /**
   * Analyze query performance
   */
  static async analyzeQuery(model: Model<any>, query: any, options: any = {}): Promise<any> {
    try {
      const explanation = await model.find(query, null, options).explain('executionStats');
      
      const stats = {
        totalDocsExamined: explanation.executionStats.totalDocsExamined,
        totalDocsReturned: explanation.executionStats.totalDocsReturned,
        executionTimeMillis: explanation.executionStats.executionTimeMillis,
        indexesUsed: explanation.executionStats.executionStages?.indexName || 'No index used',
        isEfficient: explanation.executionStats.totalDocsExamined <= explanation.executionStats.totalDocsReturned * 2,
      };

      if (!stats.isEfficient) {
        logger.warn('Inefficient query detected:', {
          query,
          stats,
          suggestion: 'Consider adding an index or optimizing the query'
        });
      }

      return stats;
    } catch (error) {
      logger.error('Failed to analyze query:', error);
      return null;
    }
  }

  /**
   * Get collection statistics
   */
  static async getCollectionStats(model: Model<any>): Promise<any> {
    try {
      const stats = await model.collection.stats();
      const indexes = await model.collection.listIndexes().toArray();
      
      return {
        documentCount: stats.count,
        avgDocumentSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        totalIndexSize: stats.totalIndexSize,
        indexCount: indexes.length,
        indexes: indexes.map(idx => ({
          name: idx.name,
          keys: idx.key,
          size: idx.size || 'Unknown'
        }))
      };
    } catch (error) {
      logger.error('Failed to get collection stats:', error);
      return null;
    }
  }
}

// Query builder for common patterns
export class OptimizedQueryBuilder {
  private model: Model<any>;
  private pipeline: any[] = [];

  constructor(model: Model<any>) {
    this.model = model;
  }

  /**
   * Add match stage with index hints
   */
  match(conditions: any, indexHint?: string): this {
    this.pipeline.push({ $match: conditions });
    
    if (indexHint) {
      this.pipeline.push({ $hint: indexHint });
    }
    
    return this;
  }

  /**
   * Add optimized lookup stage
   */
  lookup(from: string, localField: string, foreignField: string, as: string, project?: any): this {
    const lookupStage: any = {
      $lookup: {
        from,
        localField,
        foreignField,
        as
      }
    };

    // Add projection to lookup if specified
    if (project) {
      lookupStage.$lookup.pipeline = [{ $project: project }];
    }

    this.pipeline.push(lookupStage);
    return this;
  }

  /**
   * Add pagination with proper sorting
   */
  paginate(page: number, limit: number, sortField: string = '_id', sortOrder: 1 | -1 = -1): this {
    const skip = (page - 1) * limit;
    
    this.pipeline.push(
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit }
    );
    
    return this;
  }

  /**
   * Add optimized date range filter
   */
  dateRange(field: string, startDate: Date, endDate: Date): this {
    this.pipeline.push({
      $match: {
        [field]: {
          $gte: startDate,
          $lte: endDate
        }
      }
    });
    
    return this;
  }

  /**
   * Add text search
   */
  textSearch(searchText: string, fields?: string[]): this {
    if (fields) {
      // Use regex for specific fields
      const regexConditions = fields.map(field => ({
        [field]: { $regex: searchText, $options: 'i' }
      }));
      
      this.pipeline.push({
        $match: { $or: regexConditions }
      });
    } else {
      // Use text index if available
      this.pipeline.push({
        $match: { $text: { $search: searchText } }
      });
    }
    
    return this;
  }

  /**
   * Add aggregated calculations
   */
  addFields(fields: any): this {
    this.pipeline.push({ $addFields: fields });
    return this;
  }

  /**
   * Group by field with common aggregations
   */
  groupBy(field: string, aggregations: any): this {
    this.pipeline.push({
      $group: {
        _id: `$${field}`,
        ...aggregations
      }
    });
    
    return this;
  }

  /**
   * Project only necessary fields
   */
  project(fields: any): this {
    this.pipeline.push({ $project: fields });
    return this;
  }

  /**
   * Execute the aggregation pipeline
   */
  async execute(): Promise<any[]> {
    try {
      const startTime = Date.now();
      const result = await this.model.aggregate(this.pipeline).exec();
      const executionTime = Date.now() - startTime;
      
      if (executionTime > 1000) {
        logger.warn('Slow query detected:', {
          pipeline: this.pipeline,
          executionTime: `${executionTime}ms`,
          suggestion: 'Consider optimizing this aggregation pipeline'
        });
      }
      
      return result;
    } catch (error) {
      logger.error('Aggregation pipeline failed:', {
        pipeline: this.pipeline,
        error
      });
      throw error;
    }
  }

  /**
   * Explain the aggregation pipeline
   */
  async explain(): Promise<any> {
    try {
      return await this.model.aggregate(this.pipeline).explain('executionStats');
    } catch (error) {
      logger.error('Failed to explain aggregation:', error);
      throw error;
    }
  }

  /**
   * Reset the pipeline
   */
  reset(): this {
    this.pipeline = [];
    return this;
  }
}

// Database maintenance utilities
export class DatabaseMaintenance {
  /**
   * Initialize all indexes for the application
   */
  static async initializeIndexes(models: Record<string, Model<any>>): Promise<void> {
    logger.info('Initializing database indexes...');
    
    for (const [collectionName, model] of Object.entries(models)) {
      if (IndexDefinitions[collectionName as keyof typeof IndexDefinitions]) {
        await QueryOptimizer.createIndexes(model, collectionName as keyof typeof IndexDefinitions);
      }
    }
    
    logger.info('Database indexes initialization completed');
  }

  /**
   * Clean up old data based on TTL and business rules
   */
  static async cleanupOldData(): Promise<void> {
    try {
      logger.info('Starting database cleanup...');
      
      // Example cleanup operations
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      
      // Clean up old sessions (should be handled by TTL, but backup cleanup)
      const expiredSessions = await mongoose.connection.db
        .collection('sessions')
        .deleteMany({ expiresAt: { $lt: new Date() } });
      
      logger.info(`Cleaned up ${expiredSessions.deletedCount} expired sessions`);
      
      // Archive old call records (example)
      const oldCalls = await mongoose.connection.db
        .collection('calls')
        .find({ createdAt: { $lt: oneYearAgo } })
        .limit(1000)
        .toArray();
      
      if (oldCalls.length > 0) {
        // Move to archive collection
        await mongoose.connection.db
          .collection('calls_archive')
          .insertMany(oldCalls);
        
        await mongoose.connection.db
          .collection('calls')
          .deleteMany({ 
            _id: { $in: oldCalls.map(call => call._id) }
          });
        
        logger.info(`Archived ${oldCalls.length} old call records`);
      }
      
      logger.info('Database cleanup completed');
    } catch (error) {
      logger.error('Database cleanup failed:', error);
    }
  }

  /**
   * Analyze database performance
   */
  static async analyzePerformance(models: Record<string, Model<any>>): Promise<any> {
    const analysis: any = {
      collections: {},
      totalSize: 0,
      totalDocuments: 0,
      recommendations: []
    };

    try {
      for (const [name, model] of Object.entries(models)) {
        const stats = await QueryOptimizer.getCollectionStats(model);
        if (stats) {
          analysis.collections[name] = stats;
          analysis.totalSize += stats.storageSize;
          analysis.totalDocuments += stats.documentCount;

          // Generate recommendations
          if (stats.avgDocumentSize > 16000) { // 16KB threshold
            analysis.recommendations.push(`Consider document size optimization for ${name} collection`);
          }

          if (stats.totalIndexSize > stats.storageSize * 0.3) {
            analysis.recommendations.push(`Review index usage for ${name} collection - high index overhead`);
          }
        }
      }

      // Database-wide recommendations
      if (analysis.totalSize > 1000000000) { // 1GB threshold
        analysis.recommendations.push('Consider implementing data archiving strategy');
      }

      return analysis;
    } catch (error) {
      logger.error('Performance analysis failed:', error);
      return analysis;
    }
  }

  /**
   * Schedule periodic maintenance tasks
   */
  static scheduleMaintenance(): void {
    // Run cleanup every day at 2 AM
    const cleanupInterval = 24 * 60 * 60 * 1000; // 24 hours
    setInterval(async () => {
      await DatabaseMaintenance.cleanupOldData();
    }, cleanupInterval);

    // Run performance analysis every week
    const analysisInterval = 7 * 24 * 60 * 60 * 1000; // 7 days
    setInterval(async () => {
      // This would typically send the analysis to monitoring systems
      const analysis = await DatabaseMaintenance.analyzePerformance({});
      logger.info('Weekly performance analysis:', analysis);
    }, analysisInterval);

    logger.info('Database maintenance tasks scheduled');
  }
}

// Connection pool optimization
export const optimizeConnectionPool = (): void => {
  const options = {
    maxPoolSize: 10, // Maximum number of connections
    minPoolSize: 2,  // Minimum number of connections
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long a send or receive on a socket can take
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
  };

  mongoose.set('bufferCommands', false);
  logger.info('MongoDB connection pool optimized');
};
