export const getCachedData = async (key, fetchFunction, ttl = 10) => {
  const response = await fetch(`/api/cache?key=${key}`);
  const result = await response.json();

  if (result.success) {
    return result.data;
  } else {
    const data = await fetchFunction();
    await fetch(`/api/cache?key=${key}&value=${JSON.stringify(data)}&ttl=${ttl}`, { method: 'POST' });
    return data;
  }
};
