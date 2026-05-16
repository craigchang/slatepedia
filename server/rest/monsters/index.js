const monstersJson = require('./data');

function parseBound(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Normalize param to array of non-empty strings. Supports comma-separated or array. */
function toTerms(param) {
  if (!param) return [];
  if (Array.isArray(param)) {
    return param.map((p) => String(p).trim().toLowerCase()).filter(Boolean);
  }
  return String(param)
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Filters monsters by query parameters.
 * Multiselect (comma-separated): size, commonLocation, itemDrop
 * Range: hpMin/Max, rankMin/Max
 */
function filterMonsters(items, query) {
  let result = items;

  const sizeTerms = toTerms(query.size);
  if (sizeTerms.length > 0) {
    result = result.filter((m) =>
      sizeTerms.some((t) => String(m.size ?? '').trim().toLowerCase() === t)
    );
  }

  const hpMin = parseBound(query.hpMin);
  if (hpMin != null) result = result.filter((m) => Number(m.hp) >= hpMin);
  const hpMax = parseBound(query.hpMax);
  if (hpMax != null) result = result.filter((m) => Number(m.hp) <= hpMax);

  const rankMin = parseBound(query.rankMin);
  if (rankMin != null) result = result.filter((m) => Number(m.rank) >= rankMin);
  const rankMax = parseBound(query.rankMax);
  if (rankMax != null) result = result.filter((m) => Number(m.rank) <= rankMax);

  const locationTerms = toTerms(query.commonLocation);
  if (locationTerms.length > 0) {
    result = result.filter(
      (m) =>
        Array.isArray(m.commonLocations) &&
        locationTerms.some((term) =>
          m.commonLocations.some((loc) => String(loc).trim().toLowerCase() === term)
        )
    );
  }

  const itemDropTerms = toTerms(query.itemDrop);
  if (itemDropTerms.length > 0) {
    result = result.filter(
      (m) =>
        Array.isArray(m.itemDrops) &&
        itemDropTerms.some((term) =>
          m.itemDrops.some(
            (drop) =>
              (drop.name && drop.name.toLowerCase() === term) || String(drop.id) === term
          )
        )
    );
  }

  return result;
}

function getFilteredMonsters(query) {
  return filterMonsters(monstersJson, query || {});
}

module.exports = {
  filterMonsters,
  getFilteredMonsters,
  monstersJson
};
