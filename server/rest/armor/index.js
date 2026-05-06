const armorJson = require('./data');

/** Query string token for empty-string added effect / set bonus (mirrors UI). */
const NONE_TOKEN = '__none__';

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

function parseBound(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function matchesOptionalStringField(value, termLc) {
  if (termLc === NONE_TOKEN) {
    return !value || String(value).trim() === '';
  }
  return String(value ?? '')
    .trim()
    .toLowerCase() === termLc;
}

/**
 * Filters armor by query parameters.
 * Range: defenseMin, defenseMax, sellPriceMin, sellPriceMax
 * Multiselect (comma-separated): bodyPart, addedEffect, setBonus, availability
 */
function filterArmor(items, query) {
  let result = items;

  const dm = parseBound(query.defenseMin);
  if (dm != null) {
    result = result.filter((a) => Number(a.defense) >= dm);
  }
  const dx = parseBound(query.defenseMax);
  if (dx != null) {
    result = result.filter((a) => Number(a.defense) <= dx);
  }

  const sm = parseBound(query.sellPriceMin);
  if (sm != null) {
    result = result.filter((a) => Number(a.sellPrice) >= sm);
  }
  const sx = parseBound(query.sellPriceMax);
  if (sx != null) {
    result = result.filter((a) => Number(a.sellPrice) <= sx);
  }

  const bodyTerms = toTerms(query.bodyPart);
  if (bodyTerms.length > 0) {
    result = result.filter((a) =>
      bodyTerms.some(
        (t) => String(a.bodyPart ?? '').trim().toLowerCase() === t
      )
    );
  }

  const addedTerms = toTerms(query.addedEffect);
  if (addedTerms.length > 0) {
    result = result.filter((a) =>
      addedTerms.some((t) => matchesOptionalStringField(a.addedEffect, t))
    );
  }

  const setTerms = toTerms(query.setBonus);
  if (setTerms.length > 0) {
    result = result.filter((a) =>
      setTerms.some((t) => matchesOptionalStringField(a.setBonus, t))
    );
  }

  const availTerms = toTerms(query.availability);
  if (availTerms.length > 0) {
    result = result.filter((a) =>
      availTerms.some((t) => {
        const v = a.availability != null ? String(a.availability).trim().toLowerCase() : '';
        return v === t;
      })
    );
  }

  return result;
}

function getFilteredArmor(query) {
  return filterArmor(armorJson, query || {});
}

module.exports = {
  filterArmor,
  getFilteredArmor,
  armorJson
};
