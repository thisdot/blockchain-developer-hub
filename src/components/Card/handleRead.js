import { user_activities } from 'server/activities';

export default function handleRead({ cardType }) {
  let resp = {};
  switch (cardType) {
    case user_activities.tutorials:
      break;

    case user_activities.courses:
      break;

    case user_activities.hackathons:
      break;

    default:
      break;
  }

  return resp;
}
