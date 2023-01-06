import {HttpFunction} from '@google-cloud/functions-framework';
import _ from 'lodash';
import {pathValidator} from './auth/validator';
import {getInstantFileUrl} from './get/instant_file_url';

export let count = 0;

export const main: HttpFunction = async (req, res) => {
  count++;
  console.log(count);

  const path = req.path;
  const pathArr = path.split('/');

  const validatorResult = pathValidator(path);

  if (validatorResult !== true) {
    res.status(validatorResult.statusCode).send(validatorResult.message);
    throw new Error(validatorResult.message);
  }

  const requestedOperation = `${pathArr[2]}/${pathArr[3]}`;

  const operations = [
    {
      name: 'admin/admin',
      func: () => {},
    },
    {
      name: 'get/instant_file_url',
      func: () => getInstantFileUrl(req, res),
    },
  ];

  const operation = _.find(operations, {name: requestedOperation});
  operation?.func();
};
