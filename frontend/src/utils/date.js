export function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}
export function dateKey(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
export function todayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
export function startOfWeek(d) {
  const r = new Date(d);
  r.setDate(r.getDate() - r.getDay());
  r.setHours(0, 0, 0, 0);
  return r;
}
export function monthKey(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1);
}
export function fmtDateLong(d) {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
export function fmtDateShort(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function uid() {
  return 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
