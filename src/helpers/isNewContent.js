import isRecentDate from './isRecentDate';

const isNewContent = (data, lastLogIn, title) =>
  data && data.find((res) => isRecentDate(res.date, lastLogIn) && res.title === title);

export default isNewContent;
