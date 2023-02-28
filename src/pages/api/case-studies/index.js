import { decode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbCASESTUDIES from 'server/models/case-studies';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 200;
  let resp = {};
  if (method === 'GET') {
    const case_study = await dbCASESTUDIES.find({}, { _id: 0 });
    if (case_study) {
      status = 200;
      case_study.forEach((res) => {
        res.title = decode(res.title);
      });
      resp = {
        data: case_study,
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
