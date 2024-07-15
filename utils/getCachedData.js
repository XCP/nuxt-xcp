export const getCachedData = async (key, fetchFunction, ttl = 10) => {
  const response = await fetch(`/api/cache`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key }),
  })
  const result = await response.json()

  if (result.success) {
    return JSON.parse(result.data)
  }

  const data = await fetchFunction()
  await fetch(`/api/cache`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key, value: JSON.stringify(data), ttl }),
  })
  return data
}
