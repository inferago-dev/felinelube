/**
 * SECURITY: Centralised input sanitisation helpers.
 *
 * These are shared across all controllers so sanitisation is
 * consistent and not reimplemented per-file.
 */

const xss = require('xss');

// ── String sanitiser ────────────────────────────────────────────
// Trims whitespace, strips XSS payloads, and enforces a hard
// maximum length.  Returns undefined if the value is not a string
// (callers should treat undefined as "not provided").
const sanitizeStr = (val, maxLen = 500) => {
  if (typeof val !== 'string') return undefined;
  return xss(val.trim()).slice(0, maxLen);
};

// ── Email sanitiser ─────────────────────────────────────────────
// Lower-cases and trims; does NOT XSS-escape because email
// addresses must not have HTML-encoded entities stored.
const sanitizeEmail = (val) => {
  if (typeof val !== 'string') return '';
  return val.trim().toLowerCase().slice(0, 254); // RFC 5321 max
};

// ── Integer sanitiser ───────────────────────────────────────────
// Returns the parsed integer or null when the value is invalid.
// Optional min/max guard.
const sanitizeInt = (val, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const n = parseInt(val, 10);
  if (isNaN(n) || n < min || n > max) return null;
  return n;
};

// ── Float sanitiser ─────────────────────────────────────────────
const sanitizeFloat = (val, min = 0) => {
  const n = parseFloat(val);
  if (isNaN(n) || n < min) return null;
  return n;
};

// ── Route param sanitiser ───────────────────────────────────────
// Allows only alphanumeric characters, hyphens, and underscores
// to prevent path-traversal or injection via URL params.
const sanitizeParam = (val, maxLen = 128) => {
  if (typeof val !== 'string') return null;
  const clean = val.trim().replace(/[^a-zA-Z0-9\-_]/g, '');
  return clean.length > 0 ? clean.slice(0, maxLen) : null;
};

// ── Query param integer ─────────────────────────────────────────
// Convenience wrapper used for pagination.
const sanitizePageParam = (val, defaultVal = 1, min = 1, max = 1000) => {
  const n = parseInt(val, 10);
  if (isNaN(n) || n < min || n > max) return defaultVal;
  return n;
};

// ── Safe JSON parse ─────────────────────────────────────────────
// Never throws; returns fallback on invalid JSON.
const safeJsonParse = (str, fallback = null) => {
  try {
    return typeof str === 'string' ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};

// ── Email format validator ───────────────────────────────────────
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── Malaysian phone validator ───────────────────────────────────
const isValidMalaysianPhone = (phone) => {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+60|60|0)1[0-9]{8,9}$/.test(clean);
};

module.exports = {
  sanitizeStr,
  sanitizeEmail,
  sanitizeInt,
  sanitizeFloat,
  sanitizeParam,
  sanitizePageParam,
  safeJsonParse,
  isValidEmail,
  isValidMalaysianPhone,
};
