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

const trimEnd = (str: string, c: string) => {
  c = c ? c : ' ';
  let i = str.length - 1;
  for (; i >= 0 && str.charAt(i) == c; i--);
  return str.substring(0, i + 1);
};

export {trimEnd};
export type {currentCredentialType, getAccessTokenResType};
