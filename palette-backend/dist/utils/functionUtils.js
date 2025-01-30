"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDailyLimit = void 0;
const paletteModels_1 = require("../models/paletteModels");
const DAILY_LIMIT = 200; // Set your daily limit
const isNewDay = (lastReset) => {
    const now = new Date();
    const last = new Date(lastReset);
    return (now.getUTCDate() !== last.getUTCDate() ||
        now.getUTCMonth() !== last.getUTCMonth() ||
        now.getUTCFullYear() !== last.getUTCFullYear());
};
const handleDailyLimit = async (userId) => {
    try {
        // Fetch the user's limit data from the database
        let userLimit = await paletteModels_1.UserLimitModel.findOne({ userId });
        if (!userLimit) {
            // Initialize the user's data if not found
            userLimit = new paletteModels_1.UserLimitModel({
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
    }
    catch (error) {
        console.error("Error handling daily limit:", error);
        throw new Error("Failed to handle daily limit.");
    }
};
exports.handleDailyLimit = handleDailyLimit;
