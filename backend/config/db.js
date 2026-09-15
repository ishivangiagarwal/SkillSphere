const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillsphere';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to primary MongoDB (${uri}): ${error.message}`);
    if (!uri.includes('127.0.0.1') && !uri.includes('localhost')) {
      try {
        console.log('Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/skillsphere)...');
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/skillsphere', {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`Fallback MongoDB Connected: ${fallbackConn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error(`Fallback to local MongoDB also failed: ${fallbackError.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
