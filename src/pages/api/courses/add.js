import { encode } from '@/helpers/encode_decode';
import connectToDatabase from 'server/db-config';
import dbCOURSES from 'server/models/courses';

export default async function handler(req, res) {
  await connectToDatabase();
  const method = req.method;
  let status = 400;
  let resp = {};
  if (method === 'POST') {
    const { course } = JSON.parse(req.body);
    if (course.title) {
      const encodedTitle = encode(course.title);
      const match_course = await dbCOURSES.findOne({ title: encodedTitle });
      if (match_course) {
        status = 201;
        resp = {
          message: 'course already saved',
        };
      } else {
        course.title = encodedTitle;
        const result = await new dbCOURSES(course);
        const savedData = await result.save();
        if (savedData) {
          status = 200;
          resp = {
            message: 'course saved',
          };
        } else {
          status = 404;
          resp = {
            message: 'An error occured saving course',
          };
        }
      }
    } else {
      status = 400;
      resp = {
        message: 'title required for course',
      };
    }
  }

  res.status(status).json(resp);
}
