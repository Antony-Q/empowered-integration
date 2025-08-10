import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import { loadTokens, getLeadDetails, normalizeLeadFieldData } from "../src/meta.js";
import { sendToFive9 } from "../src/five9.js";

const app = express();
app.use(bodyParser.json());

// Meta verification (setup one time)
app.get("/meta/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "verify_me";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Leadgen receiver
app.post("/meta/webhook", async (req, res) => {
  try {
    const changes = req.body.entry?.[0]?.changes || [];
    for (const ch of changes) {
      if (ch.field !== "leadgen") continue;
      const page_id = ch.value.page_id;
      const leadgen_id = ch.value.leadgen_id;
      const form_id = ch.value.form_id;

      // Find Page token
      const { pages } = loadTokens();
      const page = pages.find(p => p.page_id === String(page_id));
      if (!page) {
        console.error("No page token for page_id", page_id);
        continue;
      }

      // Fetch lead details
      const lead = await getLeadDetails(leadgen_id, page.page_access_token);
      const normalized = normalizeLeadFieldData(lead.field_data);

      // Send to Five9
      const result = await sendToFive9(normalized);
      console.log("[Five9 Result]", result.substring(0, 140) + "...");
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("Webhook error", e?.response?.data || e.message);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Webhook up on :${port}`));