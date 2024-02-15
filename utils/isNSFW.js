const nsfwList = [
  'GOATSE',
  'GOATSE.CX',
  'GOATSE.THEGIVER',
  'TUBGIRL',
  'TUBGIRL.KOTAKU',
  'TUBGIRL.COM',
  'GOATSE.WEDDINGRING',
  'LEMONPARTY',
  'LEMONPARTY.ORG',
  'MEATSPIN',
  'MEATSPIN.MYSPACE',
  'MEATSPIN.GODADDY'
];

export const isNSFW = (assetName) => {
  return nsfwList.includes(assetName);
};
