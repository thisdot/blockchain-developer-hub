export default function isRecentDate(date, lastLogIn) {
  return new Date(date).getTime() > new Date(lastLogIn).getTime();
}
