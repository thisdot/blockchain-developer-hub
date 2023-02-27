export default function isRecentDate(date, lastLogin) {
  return new Date(date).getTime() > new Date(lastLogin).getTime();
}
