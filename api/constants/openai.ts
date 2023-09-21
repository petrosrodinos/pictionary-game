export const Prompt = (category: any, words: any, difficultyLevels: any) => {
  return `given the word: ${category},generate STRICTLY ${words} single objects for each category [${difficultyLevels}] related to this for an online drawing game in the format of
    {
    easy:[word1,word2,...${words}]
    medium:[word1,word2,...${words}],
    hard:[word1,word2,...${words}]
    }
    NOTE:your answer should only return only the generated object in JSON format and no other text`;
};
