import apiClient from 'counterparty-api-client'

const createCachedApiClient = (apiClient) => {
  const cachedApiClient = {}

  for (const method in apiClient) {
    if (typeof apiClient[method] === 'function') {
      cachedApiClient[method] = async (...args) => {
        let config = {}
        if (args.length > 0 && typeof args[args.length - 1] === 'object' && args[args.length - 1] !== null) {
          const lastArg = args[args.length - 1]
          if ('useCache' in lastArg || 'ttl' in lastArg) {
            config = args.pop()
          }
        }

        const useCache = config.useCache !== undefined ? config.useCache : true
        const ttl = config.ttl !== undefined ? config.ttl : 60
        const key = `${method}_${JSON.stringify(args)}`

        if (useCache) {
          return getCachedData(key, () => apiClient[method](...args), ttl)
        }
        else {
          return apiClient[method](...args)
        }
      }
    }
  }

  return cachedApiClient
}

export default defineNuxtPlugin((nuxtApp) => {
  const cachedApiClient = createCachedApiClient(apiClient)
  nuxtApp.provide('apiClient', cachedApiClient)
})
