import dotenv from "dotenv";
import OpenAI from "openai";

let openaiClient: OpenAI | null = null; // Store the client instance

async function getOpenAIClient(): Promise<OpenAI> {
  if (openaiClient) {
    return openaiClient; // Return existing client if already initialized
  }

  dotenv.config(); // Load environment variables
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables.");
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

export default getOpenAIClient;