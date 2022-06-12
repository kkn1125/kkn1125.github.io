export const cutText = (desc, limit, addFrontText) =>
  (desc?.length || 0) < limit
    ? desc && addFrontText + desc
    : addFrontText + desc.slice(0, limit) + " ...";
