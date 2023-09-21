import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../interfaces";
import { openAi } from "../utils/openai";
import { Prompt } from "../constants/openai";

export const getWords = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { category, numberOfWords, difficultyLevels } = req.query;
  const prompt = Prompt(category, numberOfWords, difficultyLevels);
  const response = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0].message.content;
  return res.status(200).json({
    result,
    category,
    prompt,
    numberOfWords,
    difficultyLevels,
  });
};
