import { UserLimitModel } from "../models/paletteModels";

const DAILY_LIMIT = 150; // Set your daily limit

const isNewDay = (lastReset: Date): boolean => {
    const now = new Date();
    const last = new Date(lastReset);
    return (
      now.getUTCDate() !== last.getUTCDate() ||
      now.getUTCMonth() !== last.getUTCMonth() ||
      now.getUTCFullYear() !== last.getUTCFullYear()
    );
  };

export const handleDailyLimit = async (userId: string): Promise<{ status: string; resetTime?: Date; }> => {
    try {
      // Fetch the user's limit data from the database
      let userLimit = await UserLimitModel.findOne({ userId });
  
      if (!userLimit) {
        // Initialize the user's data if not found
        userLimit = new UserLimitModel({
          userId,
          count: 0,
          lastReset: new Date(),
        });
      }
  
      // Reset the count if it's a new day
      if (isNewDay(userLimit.lastReset)) {
        userLimit.count = 0;
        userLimit.lastReset = new Date();
      }
  
      // Check if the user exceeds the daily limit
      if (userLimit.count >= DAILY_LIMIT) {
        const nextReset = new Date();
        nextReset.setUTCHours(24, 0, 0, 0); // Next midnight UTC
        return {
          status: "limit_exceeded",
          resetTime: nextReset,
        };
      }
  
      // Increment the count and save the updated data
      userLimit.count += 1;
      await userLimit.save();
  
      return { status: "allowed" };
    } catch (error) {
      console.error("Error handling daily limit:", error);
      throw new Error("Failed to handle daily limit.");
    }
  };
  
