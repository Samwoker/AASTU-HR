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
      const token = localStorage.getItem('token');
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
