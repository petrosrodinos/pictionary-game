import axios from "axios";
import { API_URL } from "../constants";
import { getAuthState } from "../store/authStore";
import { UserLogin, NewUser, UserToUpdate } from "../interfaces/typing";

const getConfig = () => {
  return {
    headers: { Authorization: `Bearer ${getAuthState().token}` },
  };
};

const getConfigWithFormData = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getAuthState().token}`,
    },
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

export const registerUser = async (payload: NewUser): Promise<any> => {
  try {
    const result = await axios.post(`${API_URL}user/register`, payload, getConfigWithFormData());
    return result.data;
  } catch (err: any) {
    console.log("err", err);
    throw err?.response?.data?.message;
  }
};

export const updateUser = async (payload: UserToUpdate): Promise<any> => {
  try {
    const result = await axios.put(
      `${API_URL}user/${payload.userId}`,
      payload,
      getConfigWithFormData()
    );
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

export const deleteCategory = async (userId: string, categoryId: string): Promise<any> => {
  try {
    const result = await axios.delete(
      `${API_URL}user/${userId}/category/${categoryId}`,
      getConfig()
    );
    return result.data;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};
