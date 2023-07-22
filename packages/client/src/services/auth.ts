import axios from "axios";
import { API_URL } from "../constants";

export const loginUser = async (paylaod: UserLogin): Promise<any> => {
  try {
    const result = await axios.post(`${API_URL}auth/login`, paylaod);
    return result.data;
  } catch (err) {
    console.log("err", err);
  }
};

export const registerUser = (paylaod: UserLogin): any => {
  try {
    const result = axios.post(`${API_URL}auth/register`, paylaod);
    return result.data;
  } catch (err) {
    console.log("err", err);
  }
};
