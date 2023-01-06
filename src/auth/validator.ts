import {HttpFunction} from '@google-cloud/functions-framework';
import _ from 'lodash';
import {containers, OperationType} from './users';
import validator from 'validator';

export const pathValidator = (
  path: string
): {statusCode: number; message: string} | true => {
  if (path === '/') {
    return {statusCode: 200, message: "Howdy! Here's sharepoint-accessor!"};
  }

  const pathArr = path.split('/');
  const containerId = pathArr[1];
  const requestedOperation = `${pathArr[2]}/${pathArr[3]}`;

  if (pathArr.length < 4) {
    return {statusCode: 400, message: 'syntax is invalid.'};
  }
  if (!validator.isUUID(containerId)) {
    return {statusCode: 400, message: 'containerID is invalid.'};
  }

  const container = _.find(containers, {id: containerId});

  if (container === undefined) {
    return {statusCode: 403, message: 'containerID not registered'};
  }

  if (
    requestedOperation !== 'admin/admin' &&
    requestedOperation !== 'get/instant_file_url'
  ) {
    return {statusCode: 400, message: 'requested operation not found'};
  }

  if (!container.allowedOperations.includes(requestedOperation)) {
    return {statusCode: 403, message: 'requested operation not allowed'};
  }

  return true;
};
