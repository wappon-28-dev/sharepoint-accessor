import {HttpFunction} from '@google-cloud/functions-framework';
import {getInstantFileUrl} from './get/instant_file_url';

export let count = 0;

export const main: HttpFunction = async (req, res) => {
  getInstantFileUrl(req, res);
  count++;
  console.log(count);
};
