import axios from "axios";
import { API_URL } from "../constants";
import { getAuthState } from "../store/authStore";

const getConfig = () => {
  return {
    headers: { Authorization: `Bearer ${getAuthState().token}` },
  };
};

export const getWords = async (payload: any): Promise<any> => {
  try {
    const result = await axios.get(
      `${API_URL}/words?category=${payload.category}&difficaltyLevels=${payload.difficaltyLevels}&numberOfWords=${payload.numberOfWords}`,
      getConfig()
    );
    return result.data;
  } catch (err: any) {
    console.log("err", err);
    throw err?.response?.data?.message;
  }
};
