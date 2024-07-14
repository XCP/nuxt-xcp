export function useFetchData(state, apiClientFunction) {
  const fetchData = async (offset = 0) => {
    if (state.value.loading) return

    state.value.loading = true
    state.value.items = []

    const params = {
      offset: offset,
      limit: state.value.resultsPerPage,
    }

    try {
      const response = await apiClientFunction(params)
      const data = response.data

      state.value.items = data.result
      state.value.totalItems = data.result_count
      state.value.currentPage = offset / state.value.resultsPerPage + 1
    }
    catch (error) {
      state.value.error = 'Fetch error: ' + error
    }
    finally {
      state.value.loading = false
    }
  }

  return { fetchData }
}
