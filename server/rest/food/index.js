const foodJson = require('./data');

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
 * Filters food by query parameters.
 * Range: sellPriceMin/Max, hpRecoveryMin/Max
 * Multiselect (comma-separated): ingredient (matches ingredient name or id on any ingredients[] entry)
 */
function filterFood(items, query) {
  let result = items;

  const spMin = parseBound(query.sellPriceMin);
  if (spMin != null) result = result.filter((f) => Number(f.sellPrice) >= spMin);
  const spMax = parseBound(query.sellPriceMax);
  if (spMax != null) result = result.filter((f) => Number(f.sellPrice) <= spMax);

  const hpMin = parseBound(query.hpRecoveryMin);
  if (hpMin != null) result = result.filter((f) => Number(f.hpRecovery) >= hpMin);
  const hpMax = parseBound(query.hpRecoveryMax);
  if (hpMax != null) result = result.filter((f) => Number(f.hpRecovery) <= hpMax);

  const ingredientTerms = toTerms(query.ingredient);
  if (ingredientTerms.length > 0) {
    result = result.filter(
      (f) =>
        Array.isArray(f.ingredients) &&
        ingredientTerms.some((term) =>
          f.ingredients.some(
            (ing) =>
              (ing.name && ing.name.toLowerCase() === term) || String(ing.id) === term
          )
        )
    );
  }

  return result;
}

function getFilteredFood(query) {
  return filterFood(foodJson, query || {});
}

module.exports = {
  filterFood,
  getFilteredFood,
  foodJson
};
