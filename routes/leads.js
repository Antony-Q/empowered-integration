const express = require('express');
const router = express.Router();
const campaignMap = require('../config/campaigns.config');
const buildPayload = require('../utils/payloadBuilder');
const sendToFive9 = require('../services/five9Api');

router.post('/:campaignName', async (req, res) => {
  const { campaignName } = req.params;
  const config = campaignMap[campaignName];

  if (!config) {
    return res.status(400).json({ error: 'Unknown campaign' });
  }

  try {
    const payload = buildPayload(req.body, config);
    const result = await sendToFive9(campaignName, payload);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send lead to Five9' });
  }
});

module.exports = router;