export function formatDate(inputDate: string) {
  const date = new Date(inputDate);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = date.getHours();
  const min = date.getMinutes();

  return `${dd}/${mm}/${yyyy}, ${hh}:${min}`;
}
