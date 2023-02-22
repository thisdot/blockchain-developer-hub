import mongoose from 'mongoose';
import connectToDatabase from 'server/db-config';
import dbUSERS from 'server/models/users';
import dbUSERCOURSES from 'server/models/users/courses';
const ObjectId = mongoose.Types.ObjectId;

export default async function (req, res) {
  await connectToDatabase();
  let status = 400;
  let resp = {};
  if (req.method === 'POST') {
    const { userid, title } = JSON.parse(req.body);

    if (userid && title) {
      const user = await dbUSERS.findOne({ _id: ObjectId(userid) }, { _id: 1 });
      if (user) {
        const courses = await dbUSERCOURSES.findOne(
          {
            userID: ObjectId(user._id),
          },
          {
            read: 1,
            _id: 1,
          }
        );

        if (courses) {
          const matchesTitle = await dbUSERCOURSES.findOne(
            {
              userID: ObjectId(user._id),
              read: {
                $elemMatch: {
                  title: title,
                },
              },
            },
            {
              read: 1,
              _id: 1,
            }
          );
          //Confirming there is no duplicate title
          if (matchesTitle) {
            status = 404;
            resp = {
              message: 'Duplicate title found',
            };
          } else {
            const result = await courses.updateOne({
              $push: {
                read: {
                  title,
                },
              },
            });
            if (result && result.modifiedCount > 0) {
              status = 200;
              resp = {
                message: 'Marked as read',
              };
            } else {
              resp = {
                message: 'Failed to track course',
              };
            }
          }
        } else {
          //Here we initiate read if courses hasn't been stored at all which means either read or favorite hasn't been initiated
          const result = await new dbUSERCOURSES({
            userID: ObjectId(user._id),
            read: [
              {
                title,
              },
            ],
          });
          const savedData = await result.save();
          if (savedData) {
            status = 200;
            resp = {
              message: 'tracking successful',
            };
          } else {
            resp = {
              message: 'Failed to track course',
            };
          }
        }
      } else {
        status = 404;
        resp = {
          message: 'User not found',
        };
      }
    } else {
      resp = {
        message: 'userid and title required',
      };
    }
    res.status(status).json(resp);
  }
}
