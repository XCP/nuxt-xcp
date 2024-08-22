import apiClient from 'counterparty-api-client'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('apiClient', apiClient)
})
