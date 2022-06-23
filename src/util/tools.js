export const cutText = (desc, limit, ellipsis = " ...") =>
  (desc?.length || 0) < limit ? desc && desc : desc.slice(0, limit) + ellipsis;

export const objFilter = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function readStorage() {
  return JSON.parse(localStorage["userpick"] || "[]");
}

export function saveStorage(data) {
  localStorage["userpick"] = JSON.stringify(data);
  return true;
}
