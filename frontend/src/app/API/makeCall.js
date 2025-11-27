/* eslint-disable */
import axios from "axios";
import APIError from "./APIError";
import { baseErrors } from "./ErrorCodes";

const makeCall = async (config) => {
  try {
    const fullURL = config.route;
    const headers = config.header || {};

    if (config.isSecureRoute) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await axios({
      method: config.method || "GET",
      url: fullURL,
      data: config.body,
      params: config.query,
      headers,
      responseType: config.responseType || "json",
      onUploadProgress: config.onUploadProgress,
    });

    return response;
  } catch (error) {
    if (error?.response) {
      throw new APIError(
        error.response.data?.code || "UNKNOWN_ERROR",
        error.response.data?.message || "Something went wrong"
      );
    }
    throw new APIError(baseErrors.NETWORK, "Network issue occurred");
  }
};

export default makeCall;
