import axios from 'axios';
import {
  clientId,
  clientSecret,
  currentCredentialType,
  getAccessTokenResType,
  tenantId,
} from './constant';

export const getNewCredential = async (): Promise<currentCredentialType> => {
  console.log('[･] update access Token');
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'https://graph.microsoft.com/.default');

  const res = await axios.post(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    params
  );

  const resData = res.data as getAccessTokenResType;
  const expiresDate = new Date();
  expiresDate.setMinutes(expiresDate.getMinutes() + resData.expires_in);

  const currentCredential = {
    expiresDate,
    accessToken: resData['access_token'],
  };
  console.log(
    `[*] updated currentCredential =>\n${JSON.stringify(currentCredential)}`
  );

  return currentCredential;
};
