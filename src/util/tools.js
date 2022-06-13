export const cutText = (desc, limit, addFrontText) =>
  (desc?.length || 0) < limit
    ? desc && addFrontText + desc
    : addFrontText + desc.slice(0, limit) + " ...";

export const objFilter = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
