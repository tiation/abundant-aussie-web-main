# MongoDB initialization script
# Initializes databases and collections for Rigger ecosystem
# ChaseWhiteRabbit NGO

print('=============================' + '\n' +
      'RIGGER MONGODB INITIALIZATION' + '\n' +
      '=============================' + '\n');

// Ensure all operations stop on error
try {
    // ADMIN DB - Creation of admin user
    db = db.getSiblingDB('admin');
    if (!db.system.users.findOne({ user: 'admin' })) {
        db.createUser({
            user: 'admin',
            pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
            roles: ['root']
        });
        print('Admin user created for MongoDB');
    } else {
        print('Admin user already exists in MongoDB - Skipping creation');
    }

    // RIGGER ANALYTICS DATABASE
    
    // Connect to specific database
    riggerAnalyticsDB = db.getSiblingDB('rigger_analytics');

    // Create application user
    if (!riggerAnalyticsDB.system.users.findOne({ user: 'rigger_analytics_user' })) {
        riggerAnalyticsDB.createUser({
            user: 'rigger_analytics_user',
            pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
            roles: [ { role: 'readWrite', db: 'rigger_analytics' } ]
        });
        print('Application user created for Rigger Analytics database');
    } else {
        print('Application user already in Rigger Analytics - Skipping creation');
    }

    // Create example collection (for demonstration; remove or customize in production)
    if (!riggerAnalyticsDB.getCollection('analytics_events')) {
        riggerAnalyticsDB.createCollection('analytics_events', {
            validator: { $jsonSchema: { bsonType: 'object',
                required: ['event', 'timestamp'],
                properties: {
                    event: {
                        bsonType: 'string',
                        description: 'Name of the event'
                    },
                    timestamp: {
                        bsonType: 'date',
                        description: 'UTC Date and time the event was recorded'
                    },
                    user_id: {
                        bsonType: 'objectId',
                        description: '(Optional) User ID associated with the event'
                    },
                    metadata: {
                        bsonType: 'object',
                        description: '(Optional) Additional metadata related to the event'
                    }
                }
             } } },
            capped: false,
        });
        print('Analytics events collection created in Rigger Analytics database');
    } else {
        print('Analytics events collection already exists in Rigger Analytics - Skipping creation');
    }

    // Additional custom collection creation can be added for other analytics needs

    print('MongoDB initialization process completed successfully!');
    print('=============================' + '\n');

} catch (err) {
    print('Error during MongoDB initialization: ' + err);
}
