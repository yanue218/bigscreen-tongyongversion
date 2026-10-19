// Each published category owns a fixed slot; only its merchant changes.
export function spotlightGroups(data) {
  return data.categories.map(category => ({
    category,
    stalls: data.stalls.filter(stall => stall.categoryId === category.id),
  })).filter(group => group.stalls.length).slice(0, 3);
}
export function currentMerchant(group, id) {
  return group.stalls.find(stall => stall.id === id) || group.stalls[0];
}
export function nextMerchant(group, id, direction = 1) {
  const index = group.stalls.findIndex(stall => stall.id === id);
  if (index < 0) return group.stalls[0];
  return group.stalls[(index + direction + group.stalls.length) % group.stalls.length];
}
