const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

router.post('/', (req, res) => {
  console.log('Webhook payload received:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;