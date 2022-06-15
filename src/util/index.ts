export const newDateDaysInFuture = (days: number) => {
  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}