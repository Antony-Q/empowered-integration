import "dotenv/config.js";
import { fetchManagedPages, loadTokens, saveTokens } from "../src/meta.js";

(async () => {
  const userToken = process.env.FB_LONG_LIVED_USER_TOKEN;
  const pages = await fetchManagedPages(userToken);
  const data = loadTokens();
  data.pages = pages.map(p => ({
    page_id: p.id,
    page_name: p.name,
    page_access_token: p.access_token
  }));
  saveTokens(data);
  console.log("Saved page tokens:", data.pages.length);
})();