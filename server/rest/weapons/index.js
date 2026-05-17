const weaponsJson = require('./data');

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
 * Filters weapons by query parameters.
 * Range: attackPowerBaseMin/Max, durabilityBaseMin/Max, throwDistanceBaseMin/Max
 * Multiselect (comma-separated): availability (matches any availabilities[] entry)
 */
function filterWeapons(items, query) {
  let result = items;

  const apMin = parseBound(query.attackPowerBaseMin);
  if (apMin != null) result = result.filter((w) => Number(w.attackPowerBase) >= apMin);
  const apMax = parseBound(query.attackPowerBaseMax);
  if (apMax != null) result = result.filter((w) => Number(w.attackPowerBase) <= apMax);

  const dMin = parseBound(query.durabilityBaseMin);
  if (dMin != null) result = result.filter((w) => Number(w.durabilityBase) >= dMin);
  const dMax = parseBound(query.durabilityBaseMax);
  if (dMax != null) result = result.filter((w) => Number(w.durabilityBase) <= dMax);

  const tdMin = parseBound(query.throwDistanceBaseMin);
  if (tdMin != null) result = result.filter((w) => Number(w.throwDistanceBase) >= tdMin);
  const tdMax = parseBound(query.throwDistanceBaseMax);
  if (tdMax != null) result = result.filter((w) => Number(w.throwDistanceBase) <= tdMax);

  const availTerms = toTerms(query.availability);
  if (availTerms.length > 0) {
    result = result.filter(
      (w) =>
        Array.isArray(w.availabilities) &&
        availTerms.some((term) =>
          w.availabilities.some((a) => String(a).trim().toLowerCase() === term)
        )
    );
  }

  return result;
}

function getFilteredWeapons(query) {
  return filterWeapons(weaponsJson, query || {});
}

module.exports = {
  filterWeapons,
  getFilteredWeapons,
  weaponsJson
};
