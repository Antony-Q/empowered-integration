import axios from "axios";
import fs from "fs";

const GRAPH = "https://graph.facebook.com/v19.0";
const TOKENS_PATH = "./tokens.json";

/** Load + save page tokens */
export function loadTokens() {
  if (!fs.existsSync(TOKENS_PATH)) return { pages: [] };
  return JSON.parse(fs.readFileSync(TOKENS_PATH, "utf8"));
}
export function saveTokens(data) {
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(data, null, 2));
}

/** Get pages + page tokens for the current user (using a long‑lived user token) */
export async function fetchManagedPages(userToken) {
  const url = `${GRAPH}/me/accounts?limit=200&fields=id,name,access_token`;
  const { data } = await axios.get(url, { params: { access_token: userToken } });
  return data.data || [];
}

/** Subscribe our app to leadgen events on a Page */
export async function subscribePageToLeadgen(pageId, pageToken) {
  const url = `${GRAPH}/${pageId}/subscribed_apps`;
  // subscribed_fields defaults to all the app-level subscriptions; specify leadgen explicitly:
  const { data } = await axios.post(url, null, {
    params: { subscribed_fields: "leadgen", access_token: pageToken },
  });
  return data; // {success: true}
}

/** List Instant Forms on a Page for mapping */
export async function fetchPageForms(pageId, pageToken) {
  const url = `${GRAPH}/${pageId}/leadgen_forms`;
  const { data } = await axios.get(url, {
    params: { fields: "id,name,status", access_token: pageToken, limit: 200 },
  });
  return data.data || [];
}

/** Fetch lead details (field_data) after webhook gives us leadgen_id */
export async function getLeadDetails(leadId, pageToken) {
  const url = `${GRAPH}/${leadId}`;
  const { data } = await axios.get(url, {
    params: { fields: "field_data,created_time", access_token: pageToken },
  });
  return data;
}

/** Normalize Meta field_data -> simple key:value */
export function normalizeLeadFieldData(field_data = []) {
  const obj = {};
  for (const f of field_data) {
    // Each item: { name: "email", values: ["a@b.com"] }
    obj[f.name] = Array.isArray(f.values) ? f.values[0] : f.values;
  }
  return obj;
}