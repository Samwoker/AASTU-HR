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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJjb21wYW55X2lkIjoiMSIsInJvbGVfaWQiOiIxIiwiaWF0IjoxNzY0ODcxNTAxLCJleHAiOjE3NjQ5NTc5MDF9.nf8Azl1c1IbcWMyLDMBbIo9wQ2iv3jcwjZtWFCo1nWI";
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
