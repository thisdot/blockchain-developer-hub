import { encode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbWORKSHOPS from 'server/models/workshops';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 400;
  let resp = {};
  if (method === 'POST') {
    const { workshop } = JSON.parse(req.body);
    if (workshop.title) {
      const encodedTitle = encode(workshop.title);
      const match_workshop = await dbWORKSHOPS.findOne({ title: encodedTitle });
      if (match_workshop) {
        status = 201;
        resp = {
          message: 'workshop already saved',
        };
      } else {
        workshop.title = encodedTitle;
        const result = await new dbWORKSHOPS(workshop);
        const savedData = await result.save();
        if (savedData) {
          status = 200;
          resp = {
            message: 'workshop saved',
          };
        } else {
          status = 404;
          resp = {
            message: 'An error occured saving workshop',
          };
        }
      }
    } else {
      status = 400;
      resp = {
        message: 'title required for workshop',
      };
    }
  }

  res.status(status).json(resp);
}
