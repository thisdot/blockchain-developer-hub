import mongoose from 'mongoose';
import { user_activities } from 'server/activities';
import connectToDatabase from 'server/db-config';
import dbUSERS from 'server/models/users';
import dbUSERWORKSHOPS from 'server/models/users/workshops';
const ObjectId = mongoose.Types.ObjectId;

/**
 *
 * @param {userid: string} req
 * @param {target: 'favourites' | 'read'} req
 * @param {*} res
 */
export default async function (req, res) {
  await connectToDatabase();
  let status = 400;
  let resp = {};
  if (req.method === 'POST') {
    const { userid, target } = JSON.parse(req.body);
    //userid and target are required.
    if (userid && target) {
      const user = await dbUSERS.findOne({ _id: ObjectId(userid) }, { _id: 1 });

      if (user) {
        const workshops = await dbUSERWORKSHOPS.findOne(
          { userID: ObjectId(user._id) },
          { favourites: 1, read: 1, _id: 0 }
        );
        if (workshops) {
          let data = {};
          if (target === user_activities.read) {
            // only read
            data = workshops.read;
          } else if (target === user_activities.favourites) {
            // only favourites
            data = workshops.favourites;
          } else {
            // both read and favourites
            data = workshops;
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
        message: 'userid and target required',
      };
    }

    res.status(status).json(resp);
  }
}
