import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

import { API_BASE_URL } from "../config";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}


export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export interface RequestOptions {
  token?: string | null;
  params?: QueryParams;
}

interface ServerError {
  error?: string;
  message?: string;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

function cleanParams(params?: QueryParams): QueryParams | undefined {
  if (!params) return undefined;
  const out: QueryParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axErr = error as AxiosError<ServerError>;
    const response = axErr.response;
    if (response) {
      const data = response.data;
      const message =
        (data && (data.error || data.message)) || `Erreur ${response.status}`;
      return new ApiError(message, response.status);
    }
    return new ApiError(
      "Impossible de joindre le serveur. Vérifiez votre connexion et l'URL de l'API.",
      0
    );
  }
  return new ApiError((error as Error)?.message ?? "Erreur inconnue", 0);
}

async function request<T>(
  config: AxiosRequestConfig,
  opts?: RequestOptions
): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts?.token) headers.Authorization = `Bearer ${opts.token}`;

  try {
    const res = await axiosInstance.request<T>({
      ...config,
      headers,
      params: cleanParams(opts?.params),
    });
    return res.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>({ url: path, method: "GET" }, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>({ url: path, method: "POST", data: body }, opts),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>({ url: path, method: "PUT", data: body }, opts),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>({ url: path, method: "DELETE" }, opts),
};
