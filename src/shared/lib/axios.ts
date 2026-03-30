/**
 * Axios configuration and instance
 * Base HTTP client setup with interceptors placeholder
 */

import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { appConfig } from "@/config/app.config";
import { logger } from "../utils/logger";

/**
 * Create axios instance with base configuration
 */
export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: appConfig.api.baseUrl,
    timeout: appConfig.api.timeout,
    // withCredentials: appConfig.api.withCredentials,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor for logging
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (appConfig.features.enableDebugMode) {
        logger.debug("API Request", {
          data: {
            method: config.method?.toUpperCase(),
            url: config.url,
            params: config.params,
          },
        });
      }
      return config;
    },
    (error: AxiosError) => {
      logger.error("Request interceptor error", { data: error });
      return Promise.reject(error);
    },
  );

  // Response interceptor for logging
  instance.interceptors.response.use(
    (response) => {
      if (appConfig.features.enableDebugMode) {
        logger.debug("API Response", {
          data: {
            status: response.status,
            url: response.config.url,
          },
        });
      }
      return response;
    },
    (error: AxiosError) => {
      if (appConfig.features.enableDebugMode) {
        logger.error("API Response Error", {
          data: {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
          },
        });
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

/**
 * Default axios instance
 * This will be enhanced with tenant and auth interceptors in the core/api layer
 */
export const axiosInstance = createAxiosInstance();
