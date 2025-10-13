import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/drug-recovery-survey', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
