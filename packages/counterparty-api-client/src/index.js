import { handlePagination, handleApiCall, checkApiHealth } from './utils/apiUtils'
import apiClient from './apiClient'

/**
 * Checks the health of the API before making a request.
 * @param {Function} apiFunction - The API function to call
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} config - Axios request configuration
 * @returns {Promise<Object>} - The API response data
 */
const callApiWithHealthCheck = async (apiFunction, endpoint, config) => {
  const isApiHealthy = await checkApiHealth()
  if (!isApiHealthy) {
    throw new Error('API is down')
  }
  return handleApiCall(apiFunction, endpoint, config)
}

export default {
  getStatus() {
    return handleApiCall(apiClient.get, '/v2')
  },
  getBlocks(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/blocks', { params: paginationParams })
  },
  getLastBlock(params) {
    return callApiWithHealthCheck(apiClient.get, '/v2/blocks/last', { params })
  },
  getBlockByIndex(blockIndex, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}`, { params })
  },
  getBlockByHash(blockHash, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockHash}`, { params })
  },
  getBlockTransactions(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/transactions`, { params: paginationParams })
  },
  getBlockEvents(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/events`, { params: paginationParams })
  },
  getBlockEventCounts(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/events/counts`, { params: paginationParams })
  },
  getBlockEventsByType(blockIndex, eventType, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/events/${eventType}`, { params: paginationParams })
  },
  getBlockCredits(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/credits`, { params: paginationParams })
  },
  getBlockDebits(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/debits`, { params: paginationParams })
  },
  getBlockExpirations(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/expirations`, { params: paginationParams })
  },
  getBlockCancels(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/cancels`, { params: paginationParams })
  },
  getBlockDestructions(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/destructions`, { params: paginationParams })
  },
  getBlockIssuances(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/issuances`, { params: paginationParams })
  },
  getBlockSends(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/sends`, { params: paginationParams })
  },
  getBlockDispenses(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/dispenses`, { params: paginationParams })
  },
  getBlockSweeps(blockIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/blocks/${blockIndex}/sweeps`, { params: paginationParams })
  },
  getTransactions(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/transactions', { params: paginationParams })
  },
  getTransactionInfo(rawTransaction, blockIndex = null, verbose = false) {
    return callApiWithHealthCheck(apiClient.post, '/v2/transactions/info', {
      rawtransaction: rawTransaction,
      block_index: blockIndex,
      verbose,
    })
  },
  unpackTransaction(dataHex, blockIndex = null, verbose = false) {
    return callApiWithHealthCheck(apiClient.post, '/v2/transactions/unpack', {
      datahex: dataHex,
      block_index: blockIndex,
      verbose,
    })
  },
  getTransactionByIndex(txIndex, verbose = false) {
    return callApiWithHealthCheck(apiClient.get, `/v2/transactions/${txIndex}`, { params: { verbose } })
  },
  getTransactionByHash(txHash, verbose = false) {
    return callApiWithHealthCheck(apiClient.get, `/v2/transactions/${txHash}`, { params: { verbose } })
  },
  getTransactionEventsByIndex(txIndex, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/transactions/${txIndex}/events`, { params: paginationParams })
  },
  getTransactionEventsByHash(txHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/transactions/${txHash}/events`, { params: paginationParams })
  },
  getTransactionEventsByTypeIndex(txIndex, eventType, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/transactions/${txIndex}/events/${eventType}`, { params: paginationParams })
  },
  getTransactionEventsByTypeHash(txHash, eventType, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/transactions/${txHash}/events/${eventType}`, { params: paginationParams })
  },
  getAddressBalances(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/balances`, { params: paginationParams })
  },
  getAddressBalanceByAsset(address, asset, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/balances/${asset}`, { params })
  },
  getAddressCredits(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/credits`, { params: paginationParams })
  },
  getAddressDebits(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/debits`, { params: paginationParams })
  },
  getAddressBets(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/bets`, { params: paginationParams })
  },
  getAddressBroadcasts(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/broadcasts`, { params: paginationParams })
  },
  getAddressBurns(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/burns`, { params: paginationParams })
  },
  getAddressSends(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/sends`, { params: paginationParams })
  },
  getAddressReceives(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/receives`, { params: paginationParams })
  },
  getAddressSendsByAsset(address, asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/sends/${asset}`, { params: paginationParams })
  },
  getAddressReceivesByAsset(address, asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/receives/${asset}`, { params: paginationParams })
  },
  getAddressDispensers(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/dispensers`, { params: paginationParams })
  },
  getAddressDispensersByAsset(address, asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/dispensers/${asset}`, { params: paginationParams })
  },
  getAddressDispensesSends(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/dispenses/sends`, { params: paginationParams })
  },
  getAddressDispensesReceives(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/dispenses/receives`, { params: paginationParams })
  },
  getAddressDispensesSendsByAsset(address, asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/dispenses/sends/${asset}`, { params: paginationParams })
  },
  getAddressDispensesReceivesByAsset(address, asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/dispenses/receives/${asset}`, { params: paginationParams })
  },
  getAddressSweeps(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/sweeps`, { params: paginationParams })
  },
  getAddressIssuances(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/issuances`, { params: paginationParams })
  },
  getAddressAssets(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/assets`, { params: paginationParams })
  },
  getAddressTransactions(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/transactions`, { params: paginationParams })
  },
  getAddressDividends(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/dividends`, { params: paginationParams })
  },
  getAddressOrders(address, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/addresses/${address}/orders`, { params: paginationParams })
  },
  composeBet(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/bet`, { data: params })
  },
  composeBroadcast(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/broadcast`, { data: params })
  },
  composeBTCPay(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/btcpay`, { data: params })
  },
  composeBurn(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/burn`, { data: params })
  },
  composeCancel(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/cancel`, { data: params })
  },
  composeDestroy(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/destroy`, { data: params })
  },
  composeDispenser(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/dispenser`, { data: params })
  },
  composeDividend(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/dividend`, { data: params })
  },
  composeIssuance(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/issuance`, { data: params })
  },
  composeMPMA(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/mpma`, { data: params })
  },
  composeOrder(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/order`, { data: params })
  },
  composeSend(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/send`, { data: params })
  },
  composeSweep(address, params) {
    return callApiWithHealthCheck(apiClient.post, `/v2/addresses/${address}/compose/sweep`, { data: params })
  },
  getAssets(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/assets', { params: paginationParams })
  },
  getAsset(asset, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}`, { params })
  },
  getAssetBalances(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/balances`, { params: paginationParams })
  },
  getAssetBalanceForAddress(asset, address, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/balances/${address}`, { params })
  },
  getAssetOrders(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/orders`, { params: paginationParams })
  },
  getAssetCredits(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/credits`, { params: paginationParams })
  },
  getAssetDebits(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/debits`, { params: paginationParams })
  },
  getAssetDividends(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/dividends`, { params: paginationParams })
  },
  getAssetIssuances(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/issuances`, { params: paginationParams })
  },
  getAssetSends(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/sends`, { params: paginationParams })
  },
  getAssetDispensers(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/dispensers`, { params: paginationParams })
  },
  getAssetDispenserForAddress(asset, address, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/dispensers/${address}`, { params })
  },
  getAssetHolders(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/holders`, { params: paginationParams })
  },
  getAssetDispenses(asset, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/assets/${asset}/dispenses`, { params: paginationParams })
  },
  getOrders(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/orders', { params: paginationParams })
  },
  getOrder(orderHash, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/orders/${orderHash}`, { params })
  },
  getOrderMatches(orderHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/orders/${orderHash}/matches`, { params: paginationParams })
  },
  getOrderBTCpays(orderHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/orders/${orderHash}/btcpays`, { params: paginationParams })
  },
  getOrdersForAssets(asset1, asset2, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/orders/${asset1}/${asset2}`, { params: paginationParams })
  },
  getBets(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/bets', { params: paginationParams })
  },
  getBet(betHash, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/bets/${betHash}`, { params })
  },
  getBetMatches(betHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/bets/${betHash}/matches`, { params: paginationParams })
  },
  getBetResolutions(betHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/bets/${betHash}/resolutions`, { params: paginationParams })
  },
  getBurns(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/burns', { params: paginationParams })
  },
  getDispensers(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/dispensers', { params: paginationParams })
  },
  getDispenserByHash(dispenserHash, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/dispensers/${dispenserHash}`, { params })
  },
  getDispensesByDispenser(dispenserHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/dispensers/${dispenserHash}/dispenses`, { params: paginationParams })
  },
  getDividends(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/dividends', { params: paginationParams })
  },
  getDividendByHash(dividendHash, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/dividends/${dividendHash}`, { params })
  },
  getDividendCreditsByHash(dividendHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/dividends/${dividendHash}/credits`, { params: paginationParams })
  },
  getEvents(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/events', { params: paginationParams })
  },
  getEventByIndex(eventIndex, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/events/${eventIndex}`, { params })
  },
  getEventCounts(params) {
    const paginationParams = handlePagination(params);
    return callApiWithHealthCheck(apiClient.get, 'https://app.xcp.io/api/v1/event-counts', { params: paginationParams });
  },
  getEventsByName(event, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/events/${event}`, { params: paginationParams })
  },
  getEventCountByName(event, params) {
    return callApiWithHealthCheck(apiClient.get, `/v2/events/${event}/count`, { params })
  },
  getDispenses(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/dispenses', { params: paginationParams })
  },
  getSends(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/sends', { params: paginationParams })
  },
  getIssuances(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/issuances', { params: paginationParams })
  },
  getIssuancesByHash(txHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/issuances/${txHash}`, { params: paginationParams })
  },
  getSweeps(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/sweeps', { params: paginationParams })
  },
  getSweepsByHash(txHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/sweeps/${txHash}`, { params: paginationParams })
  },
  getBroadcasts(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/broadcasts', { params: paginationParams })
  },
  getBroadcastsByHash(txHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/broadcasts/${txHash}`, { params: paginationParams })
  },
  getBitcoinAddressTransactions({ address, unconfirmed = true, only_tx_hashes = false, verbose = false }) {
    return callApiWithHealthCheck(apiClient.get, `/v2/bitcoin/addresses/${address}/transactions`, {
      params: { unconfirmed, only_tx_hashes, verbose },
    })
  },
  getOldestBitcoinAddressTransaction({ address, block_index = null, verbose = false }) {
    return callApiWithHealthCheck(apiClient.get, `/v2/bitcoin/addresses/${address}/transactions/oldest`, {
      params: { block_index, verbose },
    })
  },
  getBitcoinAddressUTXOs({ address, unconfirmed = false, unspent_tx_hash = null, verbose = false }) {
    return callApiWithHealthCheck(apiClient.get, `/v2/bitcoin/addresses/${address}/utxos`, {
      params: { unconfirmed, unspent_tx_hash, verbose },
    })
  },
  getBitcoinAddressPubkey({ address, provided_pubkeys = null, verbose = false }) {
    return callApiWithHealthCheck(apiClient.get, `/v2/bitcoin/addresses/${address}/pubkey`, {
      params: { provided_pubkeys, verbose },
    })
  },
  getBitcoinTransaction({ tx_hash, format = 'json', verbose = false }) {
    return callApiWithHealthCheck(apiClient.get, `/v2/bitcoin/transactions/${tx_hash}`, {
      params: { format, verbose },
    })
  },
  estimateSmartFee({ conf_target = 3, mode = 'CONSERVATIVE', verbose = false }) {
    return callApiWithHealthCheck(apiClient.get, '/v2/bitcoin/estimatesmartfee', {
      params: { conf_target, mode, verbose },
    })
  },
  sendBitcoinTransaction({ signedhex, verbose = false }) {
    return callApiWithHealthCheck(apiClient.post, '/v2/bitcoin/transactions', {
      signedhex,
      verbose,
    })
  },
  getMempoolEvents(params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, '/v2/mempool/events', { params: paginationParams })
  },
  getMempoolEventsByName(event, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/mempool/events/${event}`, { params: paginationParams })
  },
  getMempoolEventsByTxHash(txHash, params) {
    const paginationParams = handlePagination(params)
    return callApiWithHealthCheck(apiClient.get, `/v2/mempool/transactions/${txHash}/events`, { params: paginationParams })
  },
}
