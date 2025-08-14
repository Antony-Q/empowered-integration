const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyGhlSignature } = require('../services/ghlVerify');
const { normalizePhone } = require('../utils/phone');
const { postToFive9 } = require('../services/five9Client');

// Load route config
const cfgPath = process.env.ROUTES_PATH || './config/ghl.routes.json';
const cfg = JSON.parse(fs.readFileSync(path.resolve(cfgPath), 'utf8'));

// Simple dedupe store (replace with Redis/DB for production)
const processed = new Set();

function resolveRoute({ locationId, tags }) {
  const loc = cfg.locations[locationId];
  if (!loc) throw new Error(`Unknown locationId: ${locationId}`);
  const hit = (cfg.tagOverrides || []).find(o => (tags || []).includes(o.tag));
  return {
    five9Domain: loc.five9Domain,
    five9List: hit ? hit.list : loc.defaultList,
    asap: hit && typeof hit.asap === 'boolean' ? hit.asap : !!loc.asap
  };
}

router.post('/webhook', async (req, res) => {
  try {
    // Verify signature
    const signature = req.headers['x-wh-signature'];
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    if (!verifyGhlSignature(rawBody, String(signature || ''))) {
      return res.status(401).send('bad signature');
    }

    // Only handle ContactCreate
    const eventType = req.body?.type;
    if (eventType !== 'ContactCreate') {
      return res.status(200).send('ignored');
    }

    const wid = req.body.webhookId || req.body.id;
    if (wid && processed.has(wid)) {
      return res.status(200).send('duplicate');
    }
    processed.add(wid);

    const data = req.body.data || req.body;
    const phone = normalizePhone(data.phone);
    if (!phone) return res.status(200).send('no phone');

    const locationId = data.locationId || req.body.locationId;
    const tags = data.tags || [];
    const route = resolveRoute({ locationId, tags });

    const f9Params = {
      F9domain: route.five9Domain,
      F9list: route.five9List,
      number1: phone,
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      email: data.email || '',
      F9updateCRM: 'true',
      F9CallASAP: route.asap ? 'true' : 'false'
    };

    await postToFive9(f9Params);
    return res.status(200).send('ok');
  } catch (err) {
    console.error('ghl/webhook error', err);
    // Per GHL docs, even on processing errors we should return 200 to avoid retries:contentReference[oaicite:9]{index=9}.
    return res.status(200).send('error');
  }
});

module.exports = router;