import axios from "axios";

const {
  FIVE9_BASE,
  FIVE9_DOMAIN,
  FIVE9_LIST,
  FIVE9_AUTH_B64
} = process.env;

/** Minimal sender: maps normalized fields into Five9 params and posts */
export async function sendToFive9(normalized) {
  // Required:
  const number1 = pickPhone(normalized);

  if (!number1) {
    throw new Error("No phone found in lead (need number1).");
  }

  // Optional, but preferred:
  const first_name = normalized.first_name || normalized.first || "";
  const last_name  = normalized.last_name  || normalized.last  || "";
  const email      = normalized.email      || "";

  // Optional accelerators:
  const params = new URLSearchParams({
    F9domain: FIVE9_DOMAIN,
    F9list: FIVE9_LIST,
    F9key: "number1",
    F9updateCRM: "1",
    F9CallASAP: "1",
    F9retResults: "1",
    number1,
  });

  if (first_name) params.append("first_name", first_name);
  if (last_name)  params.append("last_name", last_name);
  if (email)      params.append("email", email);

  const { data } = await axios.post(FIVE9_BASE, params, {
    headers: {
      "Authorization": `Basic ${FIVE9_AUTH_B64}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    maxRedirects: 0, // we only need the HTML/text return
    validateStatus: () => true
  });

  return data; // HTML/response page including F9errCode in query if retURL used
}

/** Try common Meta phone field names, return digits only */
function pickPhone(n) {
  const candidates = [
    n.phone_number, n.phone, n.mobile, n.telephone,
    n["phone number"], n["mobile phone"]
  ].filter(Boolean);

  if (!candidates.length) return null;
  // Strip non-digits; keep up to 16 per Five9 guidance
  const digits = String(candidates[0]).replace(/\D+/g, "");
  return digits.length >= 10 && digits.length <= 16 ? digits : null;
}