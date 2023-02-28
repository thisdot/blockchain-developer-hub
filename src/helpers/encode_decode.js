export const encode = (str) => {
  let bufferObj = Buffer.from(str, 'utf8');

  let base64String = bufferObj.toString('base64');

  return base64String;
};
export const decode = (str) => {
  let bufferObj = Buffer.from(str, 'base64');

  let decodedString = bufferObj.toString('utf8');
  return decodedString;
};
