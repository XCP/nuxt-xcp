import axios from 'axios';
import config from './config';

/**
 * Creates an Axios instance for API calls with a base URL and headers.
 */
const apiClient = axios.create({
  baseURL: config.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to modify the request config if needed.
 */
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/**
 * Response interceptor to process response headers and format.
 */
apiClient.interceptors.response.use(
  async (response) => {
    const headers = response.headers;
    const data = response.data;
    console.log('Response Headers:', response); // Add this line to log the headers

    if (data.error) {
      return Promise.reject({
        headers: {
          content_type: headers['content-type'],
          counterparty_height: headers['x-counterparty-height'],
          bitcoin_height: headers['x-bitcoin-height'],
          counterparty_ready: headers['x-counterparty-ready'],
        },
        error: data.error,
      });
    } else {
      return {
        headers: {
          content_type: headers['content-type'],
          counterparty_height: headers['x-counterparty-height'],
          bitcoin_height: headers['x-bitcoin-height'],
          counterparty_ready: headers['x-counterparty-ready'],
        },
        data: {
          result: data.result,
          next_cursor: data.next_cursor,
          result_count: data.result_count,
        },
      };
    }
  },
  (error) => {
    const formattedError = {
      message: error.message,
      ...(error.response && { data: error.response.data, status: error.response.status }),
    };
    return Promise.reject(formattedError);
  }
);

export default apiClient;
