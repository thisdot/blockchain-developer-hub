import connectToDatabase from 'server/db-config';
import dbUSERS from 'server/models/users';

export default async function handler(req, res) {
  await connectToDatabase();
  let status = 400;
  let resp = {};
  if (req.method === 'POST') {
    //id is the base58 of the user publicKey
    const { id } = JSON.parse(req.body);
    if (id) {
      const user = await dbUSERS.findOne({ userID: id });

      if (user) {
        const result = await dbUSERS.findOneAndUpdate(
          {
            userID: id,
          },
          {
            lastLogIn: new Date(),
          },
          {
            rawResult: true,
          }
        );

        if (result && result.ok > 0) {
          status = 201;
          resp = {
            message: 'User logged in successful',
            userId: result.value._id,
            lastLogIn: user.lastLogIn,
          };
        } else {
          resp = {
            message: 'Failed to log in user',
          };
        }
      } else {
        const newUser = new dbUSERS({
          userID: id,
        });
        const result = await newUser.save();

        if (result) {
          status = 200;
          resp = {
            message: 'User sign up successful',
            userId: result._id,
            lastLogIn: result.lastLogIn,
          };
        } else {
          resp = {
            message: 'Failed to sign up user',
          };
        }
      }
    } else {
      resp = {
        message: 'id required',
      };
    }

    res.status(status).json(resp);
  }
}
