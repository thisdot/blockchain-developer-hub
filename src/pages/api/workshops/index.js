import { decode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbWORKSHOPS from 'server/models/workshops';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 200;
  let resp = {};
  if (method === 'GET') {
    const workshops = await dbWORKSHOPS.find({}, { _id: 0 });
    if (workshops) {
      status = 200;
      workshops.forEach((res) => {
        res.title = decode(res.title);
      });
      resp = {
        data: workshops,
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
