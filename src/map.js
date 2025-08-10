// Fallback: map by page_id if no direct form mapping yet.
const formToClient = {
  // "FORM_ID": { five9List: "Client - Service", ani: "xxx", skill: "yyy" }
};
const pageDefault = {
  // "PAGE_ID": { five9List: "Client - DefaultService" }
};

export function resolveClientConfig({ form_id, page_id }) {
  return formToClient[form_id] || pageDefault[page_id] || null;
}