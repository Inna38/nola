import axios from "axios";

export const instance = axios.create({
  baseURL: "https://nola-spot-python-1.onrender.com/api",
// baseURL: "https://nolatest.onrender.com/api",
  // baseURL: "https://nola-spot-python.onrender.com/api/",
});

export const token = {
  set(access) {
    instance.defaults.headers.common.Authorization = `Bearer ${access}`;
  },

  unset() {
    instance.defaults.headers.common.Authorization = "";
  },
};
