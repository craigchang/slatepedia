const bowsJson = require('./data');

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

function parseBooleanTerm(v) {
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  if (s === '') return null;
  if (['true', '1', 'yes', 'y'].includes(s)) return true;
  if (['false', '0', 'no', 'n'].includes(s)) return false;
  return null;
}

/**
 * Filters bows by query parameters.
 * Range: attackPowerMin/Max, durabilityMin/Max, rangeMin/Max, multipleArrowsMin/Max
 * Boolean: quickShot (true/false)
 * Multiselect (comma-separated): availability (matches any availabilities[] entry)
 */
function filterBows(items, query) {
  let result = items;

  const apMin = parseBound(query.attackPowerMin);
  if (apMin != null) result = result.filter((b) => Number(b.attackPower) >= apMin);
  const apMax = parseBound(query.attackPowerMax);
  if (apMax != null) result = result.filter((b) => Number(b.attackPower) <= apMax);

  const dMin = parseBound(query.durabilityMin);
  if (dMin != null) result = result.filter((b) => Number(b.durability) >= dMin);
  const dMax = parseBound(query.durabilityMax);
  if (dMax != null) result = result.filter((b) => Number(b.durability) <= dMax);

  const rMin = parseBound(query.rangeMin);
  if (rMin != null) result = result.filter((b) => Number(b.range) >= rMin);
  const rMax = parseBound(query.rangeMax);
  if (rMax != null) result = result.filter((b) => Number(b.range) <= rMax);

  const maMin = parseBound(query.multipleArrowsMin);
  if (maMin != null) result = result.filter((b) => Number(b.multipleArrows) >= maMin);
  const maMax = parseBound(query.multipleArrowsMax);
  if (maMax != null) result = result.filter((b) => Number(b.multipleArrows) <= maMax);

  const qs = parseBooleanTerm(query.quickShot);
  if (qs != null) result = result.filter((b) => Boolean(b.quickShot) === qs);

  const availTerms = toTerms(query.availability);
  if (availTerms.length > 0) {
    result = result.filter((b) => {
      if (!Array.isArray(b.availabilities) || b.availabilities.length === 0) return false;
      const listLc = b.availabilities.map((a) => String(a).trim().toLowerCase()).filter(Boolean);
      return availTerms.some((t) => listLc.includes(t));
    });
  }

  return result;
}

function getFilteredBows(query) {
  return filterBows(bowsJson, query || {});
}

module.exports = {
  filterBows,
  getFilteredBows,
  bowsJson
};
