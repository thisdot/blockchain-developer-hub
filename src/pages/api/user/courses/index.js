import mongoose from 'mongoose';
import { user_activities } from 'server/activities';
import connectToDatabase from 'server/db-config';
import dbUSERS from 'server/models/users';
import dbUSERCOURSES from 'server/models/users/courses';
const ObjectId = mongoose.Types.ObjectId;

export default async function (req, res) {
  await connectToDatabase();
  let status = 400;
  let resp = {};
  if (req.method === 'POST') {
    //target is either read or favourites else get both read and favourites 63ef62ee92963a9a25c29f7d
    const { userid, target } = JSON.parse(req.body);
    if (userid && target) {
      const user = await dbUSERS.findOne({ _id: ObjectId(userid) }, { _id: 1 });
      if (user) {
        const courses = await dbUSERCOURSES.findOne({ userID: ObjectId(user._id) }, { favourites: 1, read: 1, _id: 0 });
        if (courses) {
          let data = {};
          if (target === user_activities.read) {
            // only read
            data = courses.read;
          } else if (target === user_activities.favourites) {
            // only favourites
            data = courses.favourites;
          } else {
            // both read and favourites
            data = courses;
          }
          status = 200;
          resp = {
            message: 'Ok',
            data,
          };
        } else {
          status = 200;
          resp = {
            message: 'Nothing here',
            data: {
              read: [],
              favourites: [],
            },
          };
        }
      } else {
        status = 400;
        resp = {
          message: 'User not found',
        };
      }
    } else {
      resp = {
        message: 'Expected userid and target',
      };
    }

    res.status(status).json(resp);
  }
}
