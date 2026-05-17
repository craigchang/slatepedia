const shieldsJson = require('./data');

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
 * Filters shields by query parameters.
 * Range: durabilityMin/Max, parryPowerMin/Max
 * Multiselect (comma-separated): availability (matches any availabilities[] entry)
 */
function filterShields(items, query) {
  let result = items;

  const dMin = parseBound(query.durabilityMin);
  if (dMin != null) result = result.filter((s) => Number(s.durability) >= dMin);
  const dMax = parseBound(query.durabilityMax);
  if (dMax != null) result = result.filter((s) => Number(s.durability) <= dMax);

  const pMin = parseBound(query.parryPowerMin);
  if (pMin != null) result = result.filter((s) => Number(s.parryPower) >= pMin);
  const pMax = parseBound(query.parryPowerMax);
  if (pMax != null) result = result.filter((s) => Number(s.parryPower) <= pMax);

  const availTerms = toTerms(query.availability);
  if (availTerms.length > 0) {
    result = result.filter(
      (s) =>
        Array.isArray(s.availabilities) &&
        availTerms.some((term) =>
          s.availabilities.some((a) => String(a).trim().toLowerCase() === term)
        )
    );
  }

  return result;
}

function getFilteredShields(query) {
  return filterShields(shieldsJson, query || {});
}

module.exports = {
  filterShields,
  getFilteredShields,
  shieldsJson
};
