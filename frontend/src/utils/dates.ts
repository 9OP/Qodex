export default function formatDate(date: string): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const d = new Date(date);
  let minutes = `${d.getMinutes()}`;
  let hours = `${d.getHours()}`;
  let day = `${d.getDate()}`;
  const month = Number(d.getMonth());

  const year = d.getFullYear();

  if (day.length < 2) { day = `0${day}`; }
  if (hours.length < 2) { hours = `0${hours}`; }
  if (minutes.length < 2) { minutes = `0${minutes}`; }

  return `${[monthNames[month], day, year].join(' ')} at ${[hours, minutes].join(':')}`;
}
