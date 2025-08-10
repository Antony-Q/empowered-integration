import fs from "fs";
import { loadTokens, fetchPageForms } from "../src/meta.js";

(async () => {
  const out = [];
  const { pages } = loadTokens();
  const pilots = pages.slice(0, 5);

  for (const p of pilots) {
    try {
      const forms = await fetchPageForms(p.page_id, p.page_access_token);
      forms.forEach(f => out.push({
        page_id: p.page_id,
        page_name: p.page_name,
        form_id: f.id,
        form_name: f.name,
        status: f.status
      }));
      console.log(`Forms for ${p.page_name}:`, forms.length);
    } catch (e) {
      console.error(`Form fetch failed ${p.page_id}`, e?.response?.data || e.message);
    }
  }

  fs.writeFileSync("./forms_pilot.json", JSON.stringify(out, null, 2));
  console.log("Wrote forms_pilot.json");
})();