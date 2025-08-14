function normalizePhone(v) {
  if (!v) return "";
  return String(v).replace(/\D/g, "");
}
module.exports = { normalizePhone };