import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/todoapp";

export async function connectToMongo() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(MONGO_URI);
}
