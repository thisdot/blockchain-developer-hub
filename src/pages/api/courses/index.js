import { decode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbCOURSES from 'server/models/courses';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 200;
  let resp = {};
  if (method === 'GET') {
    const courses = await dbCOURSES.find({}, { _id: 0 });
    if (courses) {
      status = 200;
      courses.forEach((res) => {
        res.title = decode(res.title);
      });
      resp = {
        data: courses,
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
