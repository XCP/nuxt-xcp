export const formatAssetName = (assetName, assetInfo) => {
  if (assetName === 'XCP') return 'XCP'
  if (assetName === 'BTC') return 'BTC'
  return assetInfo?.asset_longname ?? assetName
}
