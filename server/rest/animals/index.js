const animalsJson = require('./data');

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
 * Filters animals by query parameters.
 * Supports multiple values per field (comma-separated or repeated params).
 * Params: uniqueCookingEffect, commonLocation, recoverableMaterial
 */
function filterAnimals(animals, query) {
  let result = animals;

  const uniqueCookingEffectTerms = toTerms(query.uniqueCookingEffect);
  if (uniqueCookingEffectTerms.length > 0) {
    result = result.filter(
      (a) =>
        a.uniqueCookingEffects &&
        uniqueCookingEffectTerms.some((term) =>
          a.uniqueCookingEffects.toLowerCase().includes(term)
        )
    );
  }

  const commonLocationTerms = toTerms(query.commonLocation);
  if (commonLocationTerms.length > 0) {
    result = result.filter(
      (a) =>
        a.commonLocations &&
        commonLocationTerms.some((term) =>
          a.commonLocations.some((loc) => loc.toLowerCase().includes(term))
        )
    );
  }

  const recoverableMaterialTerms = toTerms(query.recoverableMaterial);
  if (recoverableMaterialTerms.length > 0) {
    result = result.filter(
      (a) =>
        a.recoverableMaterials &&
        recoverableMaterialTerms.some((term) =>
          a.recoverableMaterials.some(
            (m) =>
              (m.name && m.name.toLowerCase().includes(term)) ||
              String(m.id) === term
          )
        )
    );
  }

  return result;
}

function getFilteredAnimals(query) {
  return filterAnimals(animalsJson, query || {});
}

module.exports = {
  filterAnimals,
  getFilteredAnimals,
  animalsJson
};
