import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Db Connected sucessfully.");
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};
