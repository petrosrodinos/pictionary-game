import axios from "axios";
import { API_URL } from "../constants";
import { getAuthState } from "../store/authStore";

const config = {
  headers: { Authorization: `Bearer ${getAuthState().token}` },
};

export const loginUser = async (paylaod: UserLogin): Promise<any> => {
  try {
    const result = await axios.post(`${API_URL}auth/login`, paylaod);
    return result.data;
  } catch (err) {
    console.log("err", err);
  }
};

export const registerUser = async (paylaod: NewUser): Promise<any> => {
  try {
    const result = await axios.post(`${API_URL}auth/register`, paylaod);
    return result.data;
  } catch (err) {
    console.log("err", err);
  }
};

export const updateUser = async (payload: UserToUpdate): Promise<any> => {
  try {
    const result = await axios.put(`${API_URL}auth/user/${payload.userId}`, payload, config);
    return result.data;
  } catch (err) {
    console.log("err", err);
  }
};

export const getUser = async (userId: string): Promise<any> => {
  try {
    const result = await axios.get(`${API_URL}auth/user/${userId}`, config);
    return result.data;
  } catch (err) {
    console.log("err", err);
  }
};
