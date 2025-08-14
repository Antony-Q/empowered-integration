// server/webhook.js  (CommonJS version)
require('dotenv').config();

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { verifyGhlSignature } = require('../services/ghlVerify');
const { normalizePhone } = require('../utils/phone');
const { postToFive9 } = require('../services/five9Client');

// Load routing map
const cfgPath = process.env.ROUTES_PATH || './config/ghl.routes.json';
const cfg = JSON.parse(fs.readFileSync(path.resolve(cfgPath), 'utf8'));

// simple in-memory idempotency (swap for Redis later)
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
    // Verify signature (comment the next 4 lines TEMPORARILY if you need to bypass for testing)
    const signature = req.headers['x-wh-signature'];
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const valid = verifyGhlSignature(rawBody, String(signature || ''));
    if (!valid) return res.status(401).send('bad signature');

    const eventType = req.body?.type;
    if (eventType !== 'ContactCreate' && eventType !== 'ContactTagUpdate') {
      return res.status(200).send('ignored');
    }

    const wid = req.body.webhookId || req.body.id;
    if (wid) {
      if (processed.has(wid)) return res.status(200).send('duplicate');
      processed.add(wid);
    }

    const data = req.body.data || req.body;
    const phone = normalizePhone(data.phone || data.phoneNumber);
    if (!phone) return res.status(200).send('ok'); // ack per GHL best practice

    const locationId = data.locationId || req.body.locationId;
    const tags = data.tags || [];
    const route = resolveRoute({ locationId, tags });

    const f9 = {
      F9domain: route.five9Domain,
      F9list: route.five9List,
      number1: phone,
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      email: data.email || '',
      F9updateCRM: 'true',
      F9CallASAP: route.asap ? 'true' : 'false'
    };

    await postToFive9(f9);
    return res.status(200).send('ok');
  } catch (e) {
    console.error('GHL webhook error:', e);
    // Return 200 to avoid webhook retry storms unless truly down
    return res.status(200).send('error');
  }
});

module.exports = router;