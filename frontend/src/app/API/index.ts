import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

export interface IAPICallConfig {
  route: string;
  method: Method;
  body?: any;
  query?: any;
  isSecureRoute?: boolean;
}

const makeCall = async (config: IAPICallConfig): Promise<AxiosResponse> => {
  try {
    const { method, route, body, query, isSecureRoute = true } = config;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isSecureRoute) {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJjb21wYW55X2lkIjoiMSIsInJvbGVfaWQiOiIxIiwiaWF0IjoxNzY0MzYyMjc2LCJleHAiOjE3NjQ0NDg2NzZ9.8QLcswXLYr91FDtbjFjAF_0sB5fZ7gZT0z8evTiffmA";
      // const token = localStorage.getItem('token');
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: route,
      data: body,
      params: query,
      headers,
    };

    const response = await axios(axiosConfig);

    return response;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export default makeCall;
