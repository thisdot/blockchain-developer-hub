import mongoose from 'mongoose';
import connectToDatabase from 'server/db-config';
import dbUSERS from 'server/models/users';
import dbUSERCASESTUDIES from 'server/models/users/case-studies';
const ObjectId = mongoose.Types.ObjectId;

/**
 *
 * @param {action: 1 | 0} req // 1: add, 0: remove
 * @param {title: string} req
 * @param {userid: string} req
 *
 */

export default async function (req, res) {
  await connectToDatabase();
  let status = 400;
  let resp = {};
  if (req.method === 'POST') {
    const { userid, title, action } = JSON.parse(req.body);

    if (userid && title && action !== undefined) {
      const user = await dbUSERS.findOne({ _id: ObjectId(userid) }, { _id: 1 });
      if (user) {
        const case_studies = await dbUSERCASESTUDIES.findOne({ userID: ObjectId(user._id) }, { favourites: 1, _id: 1 });
        if (case_studies) {
          const matchesTitle = await dbUSERCASESTUDIES.findOne(
            {
              userID: ObjectId(user._id),
              favourites: { $elemMatch: { title: title } },
            },
            {
              favourites: 1,
              _id: 1,
            }
          );
          //Preventing duplicate titles from being added
          if (matchesTitle && action === 1) {
            status = 404;
            resp = {
              message: 'Duplicate title found',
            };
          } else if (matchesTitle && action === 0) {
            // Remove as favourite
            const result = await case_studies.updateOne({
              $pull: {
                favourites: { title },
              },
            });

            if (result && result.modifiedCount > 0) {
              status = 200;
              resp = {
                message: 'Favourite removed',
              };
            } else {
              resp = {
                message: 'Failed to remove favourite case study',
              };
            }
          } else if (!matchesTitle && action === 1) {
            //add title if title does exist
            const result = await case_studies.updateOne({
              $push: {
                favourites: { title },
              },
            });
            if (result && result.modifiedCount > 0) {
              status = 200;
              resp = {
                message: 'Favourite added',
              };
            } else {
              resp = {
                message: 'Failed to add favourite case study',
              };
            }
          } else {
            status = 404;
            resp = {
              message: 'Seems you are trying to remove a case study that does not exist',
            };
          }
        } else {
          //Initiate case study in case either read or favourites are all empty
          const result = await new dbUSERCASESTUDIES({
            userID: ObjectId(user._id),
            favourites: [{ title }],
          });
          const savedData = await result.save();
          if (savedData) {
            status = 200;
            resp = {
              message: 'Favourite added',
            };
          } else {
            resp = {
              message: 'Failed to add favourite case study',
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
        message: 'userid, title and action required',
      };
    }
    res.status(status).json(resp);
  }
}
