if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

type currentCredentialType = {
  expiresDate: Date;
  accessToken: string;
};

type getAccessTokenResType = {
  token_type: 'Bearer';
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};

const clientId = process.env.clientId as string;
const clientSecret = process.env.clientSecret as string;
const tenantId = process.env.tenantId as string;
const assetBaseUrl = process.env.assetBaseUrl as string;
const sharingApiBaseUrl = process.env.sharingApiBaseUrl as string;

const trimEnd = (str: string, c: string) => {
  c = c ? c : ' ';
  let i = str.length - 1;
  for (; i >= 0 && str.charAt(i) == c; i--);
  return str.substring(0, i + 1);
};

export {
  clientId,
  clientSecret,
  tenantId,
  assetBaseUrl,
  sharingApiBaseUrl,
  trimEnd,
};
export type {currentCredentialType, getAccessTokenResType};
