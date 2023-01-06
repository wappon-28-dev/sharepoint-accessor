import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';
import axios from 'axios';
import _ from 'lodash';
import {getNewCredential} from '../access_token';
import {assetBaseUrl, sharingApiBaseUrl} from '../auth/env';
import {containers, ContainersType} from '../auth/users';
import {currentCredentialType, trimEnd} from '../constant';

let currentCredential: currentCredentialType | null = null;

const getContainerName = (path: string): string => {
  const pathArr = path.split('/');
  const containerId = pathArr[1];
  const container = _.find(containers, {id: containerId});
  return container!.containerName;
};

const getFilePath = (path: string) => {
  const pathArr = path.split('/');
  const filePathArr = _.slice(pathArr, 4, pathArr.length);
  return filePathArr.join('/');
};

const filePath2sharingToken = (
  containerName: string,
  filePath: string
): string => {
  const targetFilePath = `${assetBaseUrl}/${containerName}/${filePath}`;
  console.log(`[･] targetFilePath=> ${targetFilePath}`);

  const value = Buffer.from(targetFilePath).toString('base64');
  return 'u!' + trimEnd(value, '=').replace(/\//g, '_').replace(/\+/g, '-');
};

const getInstantUrl = async (sharingToken: string): Promise<string> => {
  console.log('[･] getting instant url...');

  const res = await axios.get(
    `${sharingApiBaseUrl}/${sharingToken}/driveItem`,
    {
      headers: {
        Authorization: `Bearer ${currentCredential?.accessToken}`,
      },
    }
  );

  console.log(
    `[*] GET sharingAPI received successfully =>\n${JSON.stringify(res.data)}`
  );

  return res.data['@microsoft.graph.downloadUrl'];
};

export const getInstantFileUrl: HttpFunction = async (req, res) => {
  console.log('[*] == started getFileUrl() ==');

  const path = req.path;

  const containerName = getContainerName(path);
  const filePath = getFilePath(path);

  const now = new Date();
  if (currentCredential === null || now > currentCredential.expiresDate) {
    console.log('[･] currentCredential is null or expired');
    const newCredential = await getNewCredential().catch(err => {
      const errReason = err.response.data;

      console.log(
        `[!] cannot update credential => \n ${JSON.stringify(errReason)}`
      );
      res.status(500).send({
        message: 'cannot update credential',
        reason: errReason,
      });

      throw Error('cannot update credential');
    });
    currentCredential = newCredential;
  }

  console.log('[*] checked valid currentCredential');

  const sharingToken = filePath2sharingToken(containerName, filePath);
  console.log(`[･] sharingToken: ${sharingToken}`);

  const instantUrl = await getInstantUrl(sharingToken).catch(err => {
    const errReason = err.response.data;

    console.log(`[!] cannot get instantUrl => \n ${JSON.stringify(errReason)}`);
    res.status(404).send({
      message: 'cannot get instantUrl',
      reason: errReason,
    });

    throw Error('cannot get instantUrl');
  });

  res.redirect(`${instantUrl}`);
};
