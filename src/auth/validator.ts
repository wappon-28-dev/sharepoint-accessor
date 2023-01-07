import _ from 'lodash';
import {containers} from './users';
import validator from 'validator';
import {Response} from 'express';
import {throwErr} from '../constant';
import {getFilePath} from '../get/util';

export const pathValidator = (res: Response, path: string): void | never => {
  if (path === '/') {
    res.send("Howdy! Here's sharepoint-accessor!");
  }

  const pathArr = path.split('/');
  const containerId = pathArr[1];
  const requestedOperation = `${pathArr[2]}/${pathArr[3]}`;

  if (pathArr.length < 4) {
    throwErr(res, 400, 'Syntax is invalid', '');
  }
  if (!validator.isUUID(containerId)) {
    throwErr(res, 400, 'ContainerID is invalid', '');
  }

  const container = _.find(containers, {id: containerId});

  if (container === undefined) {
    throwErr(res, 403, 'ContainerID not registered', '');
    return;
  }

  if (
    requestedOperation !== 'admin/admin' &&
    requestedOperation !== 'get/inst_file_url'
  ) {
    throwErr(res, 400, 'Requested operation not found', '');
    process.exit(1);
  }

  if (!container.allowedOperations.includes(requestedOperation)) {
    throwErr(
      res,
      405,
      'Method not allowed',
      'Requested operation not allowed on this containerId'
    );
  }
};

export const getInstFileUrlValidator = (
  res: Response,
  path: string
): void | never => {
  const filePath = getFilePath(path);

  if ((filePath.match(/\./g) || []).length !== 1) {
    throwErr(
      res,
      400,
      'Syntax is invalid',
      'The number of file extension (period) is not 1'
    );
  }
};
