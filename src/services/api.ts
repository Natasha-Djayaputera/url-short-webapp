import axios, { AxiosError } from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function isAxiosError<T>(
  candidate: unknown
): candidate is AxiosError<T> {
  return (
    typeof candidate === "object" &&
    candidate !== null &&
    "isAxiosError" in candidate &&
    (candidate as AxiosError).isAxiosError === true
  );
}

export interface CreateShortUrlRequestBody {
  id?: string;
  originalUrl: string;
}

export interface SerializableUrlsModelAttributes {
  shortenedUrl: string;
  originalUrl: string;
  isCustom: boolean;
  visitCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type ShortUrlResponseData = Pick<
  SerializableUrlsModelAttributes,
  "originalUrl" | "shortenedUrl"
>;

export interface SuccessResponseBody<T extends Record<string, unknown>> {
  code: "success";
  data: T;
}

export interface FailResponseBody {
  code: "fail";
  error: { message: string };
}

export async function shortenUrl(originalUrl: string, id?: string) {
  const data: CreateShortUrlRequestBody = { id, originalUrl };
  
  return await axios.post<SuccessResponseBody<ShortUrlResponseData>>(
    `${API_BASE_URL}/short-urls`,
    data
  );
}

export type StatisticsResponseData = Pick<
  SerializableUrlsModelAttributes,
  "createdAt" | "isCustom" | "originalUrl" | "shortenedUrl" | "visitCount"
>;

export async function checkStatistics(id: string) {
  return await axios.get<SuccessResponseBody<StatisticsResponseData>>(
    `${API_BASE_URL}/${id}/stats`
  );
}
