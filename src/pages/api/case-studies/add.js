import { encode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbCASESTUDIES from 'server/models/case-studies';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 400;
  let resp = {};
  if (method === 'POST') {
    const { case_study } = JSON.parse(req.body);
    if (case_study.title) {
      const encodedTitle = encode(case_study.title);
      const match_case_study = await dbCASESTUDIES.findOne({ title: encodedTitle });
      if (match_case_study) {
        status = 201;
        resp = {
          message: 'case study already saved',
        };
      } else {
        case_study.title = encodedTitle;
        const result = await new dbCASESTUDIES(case_study);
        const savedData = await result.save();
        if (savedData) {
          status = 200;
          resp = {
            message: 'case study saved',
          };
        } else {
          status = 404;
          resp = {
            message: 'An error occured saving case study',
          };
        }
      }
    } else {
      status = 400;
      resp = {
        message: 'title required for case studies',
      };
    }
  }

  res.status(status).json(resp);
}
