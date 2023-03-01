import { decode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbTUTORIALS from 'server/models/tutorials';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 200;
  let resp = {};
  if (method === 'GET') {
    const tutorials = await dbTUTORIALS.find({}, { _id: 0 });
    if (tutorials) {
      status = 200;
      tutorials.forEach((res) => {
        res.title = decode(res.title);
      });
      resp = {
        data: tutorials,
        message: 'fetch completed',
      };
    } else {
      status = 400;
      resp = {
        message: 'something went wrong, try again',
      };
    }
  }

  res.status(status).json(resp);
}
