import apiClient from '../apiClient';
import redis from '../redisClient';

/**
 * Handle pagination by either cursor or offset.
 * @param {Object} params - Parameters for pagination
 * @param {string} params.cursor - Cursor for pagination
 * @param {number} params.limit - Limit of items per page
 * @param {number} params.offset - Offset for pagination
 * @returns {Object} - Pagination parameters
 */
export const handlePagination = (params) => {
  const { cursor, limit, offset } = params;
  if (cursor) {
    return { cursor, limit };
  } else if (offset) {
    return { offset, limit };
  } else {
    return { limit };
  }
};

/**
 * Handles API calls with caching and error handling.
 * @param {Function} apiFunction - The API function to call
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} config - Axios request configuration
 * @returns {Promise<Object>} - The API response data
 */
export const handleApiCall = async (apiFunction, endpoint, config) => {
  const cacheKey = `${endpoint}:${JSON.stringify(config.params || {})}`;
  const cachedResponse = await redis.json.get(cacheKey, '$');

  if (cachedResponse) {
    return cachedResponse[0];
  }

  try {
    const response = await apiFunction(endpoint, config);
    const responseData = {
      headers: response.headers,
      data: response.data
    };
    await redis.json.set(cacheKey, '$', responseData);
    await redis.expire(cacheKey, 300); // Set expiration for 5 minutes
    return responseData;
  } catch (error) {
    console.error(`API call failed: ${JSON.stringify(error, null, 2)}`);
    throw formatError(error);
  }
};

/**
 * Format the error object for better readability.
 * @param {Object} error - The error object to format
 * @returns {Object} - Formatted error object
 */
function formatError(error) {
  if (typeof error === 'string') {
    return { message: error };
  }

  if (error.message) {
    return { message: error.message };
  }

  try {
    return { message: JSON.stringify(error, null, 2) };
  } catch (jsonError) {
    return { message: String(error) };
  }
}

/**
 * Checks the health of the API.
 * @returns {Promise<boolean>} - API health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/healthz');
    return response.data.result.status === 'Healthy';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
