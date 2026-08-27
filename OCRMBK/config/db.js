const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error.message);

    process.exit(1);
  }
};

// Handle graceful connection close on termination signals
const gracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close();
    console.log(`\n✅ MongoDB Connection Closed gracefully via ${signal}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error closing MongoDB connection via ${signal}:`, error.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

module.exports = connectDB;

