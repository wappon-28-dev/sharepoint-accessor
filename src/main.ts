import {HttpFunction} from '@google-cloud/functions-framework';
import {getInstantFileUrl} from './get/instant_file_url';

export let count = 0;

export const main: HttpFunction = async (req, res) => {
  const path = req.path;
  console.log(path);
  switch (path) {
    case '/':
      res.status(200).send("Howdy! Here's sharepoint-accessor!");
      break;

    case '/test/get/instant_file_url':
      getInstantFileUrl(req, res);
      break;

    default:
      res.status(404).send('requested path not found');
      break;
  }

  count++;
  console.log(count);
};
