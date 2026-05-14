const materialsJson = require('./data');

/** Query token for “no value” rows (null category, empty grade, etc.). */
const NONE_TOKEN = '__none__';

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
 * Filters materials by query parameters.
 * Multiselect (comma-separated): type, category, bonusEffect, potencyGrade, availability
 * Range: sellPriceMin/Max, hpRecoveryMin/Max, durationFactorMin/Max
 */
function filterMaterials(items, query) {
  let result = items;

  const typeTerms = toTerms(query.type);
  if (typeTerms.length > 0) {
    result = result.filter((m) =>
      typeTerms.some((t) => String(m.type ?? '').trim().toLowerCase() === t)
    );
  }

  const spMin = parseBound(query.sellPriceMin);
  if (spMin != null) result = result.filter((m) => Number(m.sellPrice) >= spMin);
  const spMax = parseBound(query.sellPriceMax);
  if (spMax != null) result = result.filter((m) => Number(m.sellPrice) <= spMax);

  const hpMin = parseBound(query.hpRecoveryMin);
  if (hpMin != null) result = result.filter((m) => Number(m.hpRecovery) >= hpMin);
  const hpMax = parseBound(query.hpRecoveryMax);
  if (hpMax != null) result = result.filter((m) => Number(m.hpRecovery) <= hpMax);

  const dfMin = parseBound(query.durationFactorMin);
  if (dfMin != null) result = result.filter((m) => Number(m.durationFactor) >= dfMin);
  const dfMax = parseBound(query.durationFactorMax);
  if (dfMax != null) result = result.filter((m) => Number(m.durationFactor) <= dfMax);

  const categoryTerms = toTerms(query.category);
  if (categoryTerms.length > 0) {
    result = result.filter((m) =>
      categoryTerms.some((t) => {
        if (t === NONE_TOKEN) return !m.category;
        return m.category && String(m.category.name ?? '').trim().toLowerCase() === t;
      })
    );
  }

  const bonusTerms = toTerms(query.bonusEffect);
  if (bonusTerms.length > 0) {
    result = result.filter((m) =>
      bonusTerms.some((t) => {
        if (t === NONE_TOKEN) {
          return (
            !m.category ||
            !m.category.addedEffect ||
            String(m.category.addedEffect).trim() === ''
          );
        }
        return (
          m.category &&
          String(m.category.addedEffect ?? '').trim().toLowerCase() === t
        );
      })
    );
  }

  const gradeTerms = toTerms(query.potencyGrade);
  if (gradeTerms.length > 0) {
    result = result.filter((m) =>
      gradeTerms.some((t) => {
        if (t === NONE_TOKEN) {
          return !m.potencyGrade || String(m.potencyGrade).trim() === '';
        }
        return String(m.potencyGrade ?? '').trim().toLowerCase() === t;
      })
    );
  }

  const availTerms = toTerms(query.availability);
  if (availTerms.length > 0) {
    result = result.filter(
      (m) =>
        Array.isArray(m.availabilities) &&
        availTerms.some((t) =>
          m.availabilities.some((a) => String(a).trim().toLowerCase() === t)
        )
    );
  }

  return result;
}

function getFilteredMaterials(query) {
  return filterMaterials(materialsJson, query || {});
}

module.exports = {
  filterMaterials,
  getFilteredMaterials,
  materialsJson
};
