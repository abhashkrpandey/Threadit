export default function DateTime({ date }) {
  const dateObj = new Date(date);
  const currentDate = new Date();
  let record = 0;
  if (currentDate.getFullYear() - dateObj.getFullYear() === 0) {
    if (currentDate.getMonth() - dateObj.getMonth() === 0) {
      if (currentDate.getDay() - dateObj.getDay() === 0) {
        if (currentDate.getHours() - dateObj.getHours() === 0) {
          record = currentDate.getMinutes() - dateObj.getMinutes() + "minute";
        } else {
          record = currentDate.getHours() - dateObj.getHours() + "hour";
        }
      } else {
        record = currentDate.getDay() - dateObj.getDay() + "day";
      }
    } else {
      record = currentDate.getMonth() - dateObj.getMonth() + "month";
    }
  } else {
    record = currentDate.getFullYear() - dateObj.getFullYear() + "year";
  }
  return <>{record}ago</>;
}
