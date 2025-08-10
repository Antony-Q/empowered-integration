import { loadTokens, subscribePageToLeadgen } from "../src/meta.js";

(async () => {
  const { pages } = loadTokens();
  // Narrow to 3–5 pilot pages for the “fast slice”
  const pilots = pages.slice(0, 5);

  for (const p of pilots) {
    try {
      const r = await subscribePageToLeadgen(p.page_id, p.page_access_token);
      console.log(`Subscribed ${p.page_name} (${p.page_id}) →`, r);
    } catch (e) {
      console.error(`Subscribe failed ${p.page_id}`, e?.response?.data || e.message);
    }
  }
})();