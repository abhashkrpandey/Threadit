export default function DateTime({ date }) {
  const dateObj = new Date(date);
  const currentDate = new Date();
  let record = 0;
  if (currentDate.getFullYear() - dateObj.getFullYear() === 0) {
    if (currentDate.getMonth() - dateObj.getMonth() === 0) {
      if (currentDate.getDate() - dateObj.getDate() === 0) {
        if (currentDate.getHours() - dateObj.getHours() === 0) {
          record = currentDate.getMinutes() - dateObj.getMinutes();
          record = record > 1 ? record + "minutes " : record + "minute ";
        } else {
          record = currentDate.getHours() - dateObj.getHours();
          record = record > 1 ? record + "hours " : record + "hour ";
        }
      } else {
        record = currentDate.getDate() - dateObj.getDate();
        record = record > 1 ? record + "days " : record + "day ";
      }
    } else {
      record = currentDate.getMonth() - dateObj.getMonth();
      record = record > 1 ? record + "months " : record + "month ";
    }
  } else {
    record = currentDate.getFullYear() - dateObj.getFullYear();
    record = record > 1 ? record + "years " : record + "year ";
  }
  return <>{record}ago</>;
}
