export const VALID_STATUSES = new Set(['want', 'reading', 'finished']);

export function allowedStatuses() {
  return [...VALID_STATUSES];
}

export function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidRating(value) {
  return Number.isInteger(value) && value >= 0 && value <= 5;
}

export function hasField(body, field) {
  return Object.prototype.hasOwnProperty.call(body, field);
}
