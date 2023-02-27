import mongoose from 'mongoose';
import connectToDatabase from 'server/db-config';
import dbUSERS from 'server/models/users';
import dbUSERWORKSHOPS from 'server/models/users/workshops';
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
        const workshops = await dbUSERWORKSHOPS.findOne(
          {
            userID: ObjectId(user._id),
          },
          {
            read: 1,
            _id: 1,
          }
        );

        if (workshops) {
          const matchesTitle = await dbUSERWORKSHOPS.findOne(
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
          //checking for duplicate title
          if (matchesTitle) {
            status = 404;
            resp = {
              message: 'Duplicate title found',
            };
          } else {
            const result = await workshops.updateOne({
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
                message: 'Failed to track workshop',
              };
            }
          }
        } else {
          //Initiate workshop in case either read or favourites are all empty
          const result = await new dbUSERWORKSHOPS({
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
              message: 'Failed to track workshop',
            };
          }
        }
      } else {
        resp = {
          message: 'User not found',
        };
      }
    } else {
      resp = {
        message: 'Expected userid and title',
      };
    }
    res.status(status).json(resp);
  }
}
