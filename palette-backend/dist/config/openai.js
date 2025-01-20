"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
let openaiClient = null; // Store the client instance
async function getOpenAIClient() {
    if (openaiClient) {
        return openaiClient; // Return existing client if already initialized
    }
    dotenv_1.default.config(); // Load environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set in environment variables.");
    }
    openaiClient = new openai_1.default({ apiKey });
    return openaiClient;
}
exports.default = getOpenAIClient;
