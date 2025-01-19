import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HOST_SERVE } from "./Endpoint";

const apiClient = axios.create({
  baseURL: HOST_SERVE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  data?: any, // ข้อมูลสำหรับส่งใน body
  params?: Record<string, any>, // พารามิเตอร์ query string
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.request({
      method,
      url: endpoint,
      data,
      params,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Request Error:", error);
    throw error.response?.data || new Error("API Error");
  }
}
