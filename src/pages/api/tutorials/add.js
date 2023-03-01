import { encode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbTUTORIALS from 'server/models/tutorials';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 400;
  let resp = {};
  if (method === 'POST') {
    const { tutorial } = JSON.parse(req.body);
    if (tutorial.title) {
      const encodedTitle = encode(tutorial.title);
      const match_tutorial = await dbTUTORIALS.findOne({ title: encodedTitle });
      if (match_tutorial) {
        status = 201;
        resp = {
          message: 'tutorial already saved',
        };
      } else {
        tutorial.title = encodedTitle;
        const result = await new dbTUTORIALS(tutorial);
        const savedData = await result.save();
        if (savedData) {
          status = 200;
          resp = {
            message: 'tutorial saved',
          };
        } else {
          status = 404;
          resp = {
            message: 'An error occurred saving tutorial',
          };
        }
      }
    } else {
      status = 400;
      resp = {
        message: 'title required for tutorial',
      };
    }
  }

  res.status(status).json(resp);
}
