import axios, { AxiosError, AxiosHeaders } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { tokenStorage } from "../lib/token";
import type { ApiError } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        tokenStorage.clearAll();
      }
      const message = (data as { detail?: string })?.detail ?? error.message;
      return Promise.reject<ApiError>({
        status,
        message,
        details: data,
      });
    }

    if (error.request) {
      return Promise.reject<ApiError>({
        status: 0,
        message: "Network error. Please check your connection.",
      });
    }

    return Promise.reject<ApiError>({
      status: -1,
      message: error.message,
    });
  }
);

export { apiClient };
