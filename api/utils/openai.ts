const OpenAIApi = require("openai");

export const openAi = new OpenAIApi({
  apiKey: process.env.OPEN_AI_API_KEY || "",
});
