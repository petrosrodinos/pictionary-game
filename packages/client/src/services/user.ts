import axios from "axios";
import { API_URL } from "../constants";
import { getAuthState } from "../store/authStore";
import { UserLogin, NewUser, UserToUpdate } from "../interfaces/typing";

const getConfig = () => {
  return {
    headers: { Authorization: `Bearer ${getAuthState().token}` },
  };
};

export const loginUser = async (paylaod: UserLogin): Promise<any> => {
  try {
    const result = await axios.post(`${API_URL}user/login`, paylaod);
    return result.data;
  } catch (err: any) {
    console.log("err", err);
    throw err?.response?.data?.message;
  }
};

export const registerUser = async (paylaod: NewUser): Promise<any> => {
  try {
    const result = await axios.post(`${API_URL}user/register`, paylaod);
    return result.data;
  } catch (err: any) {
    console.log("err", err);
    throw err?.response?.data?.message;
  }
};

export const updateUser = async (payload: UserToUpdate): Promise<any> => {
  try {
    const result = await axios.put(`${API_URL}user/${payload.userId}`, payload, getConfig());
    console.log("result", result.data);
    return result.data;
  } catch (err: any) {
    console.log("err", err);
    throw err?.response?.data?.message;
  }
};

export const getUser = async (userId: string): Promise<any> => {
  try {
    const result = await axios.get(`${API_URL}user/${userId}`, getConfig());
    return result.data;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

export const getUsers = async (): Promise<any> => {
  try {
    const result = await axios.get(`${API_URL}users`, getConfig());
    return result.data;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};
