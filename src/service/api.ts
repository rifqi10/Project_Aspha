import axios from "axios";

const DUMMY_BASE_URL = "https://dummyjson.com";
const EMAIL_API_KEY = process.env.NEXT_PUBLIC_ABSTRACT_EMAIL_API_KEY;
const PHONE_API_KEY = process.env.NEXT_PUBLIC_ABSTRACT_PHONE_API_KEY;

export const fetchUsers = async (limit = 10, skip = 0) => {
  const res = await axios.get(`${DUMMY_BASE_URL}/users`, {
    params: { limit, skip },
  });
  return res.data;
};

export const validateEmail = async (email: string) => {
  const res = await axios.get(`https://emailvalidation.abstractapi.com/v1/`, {
    params: { api_key: EMAIL_API_KEY, email },
  });
  return res.data;
};

export const validatePhone = async (phone: string) => {
  const res = await axios.get(`https://phonevalidation.abstractapi.com/v1/`, {
    params: { api_key: PHONE_API_KEY, phone },
  });
  return res.data;
};
