const express = require('express');
const router = express.Router();
const { sendToFive9 } = require('../utils/five9'); // ✅ import the utility

// Meta Webhook Verification (GET)
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

// Meta Webhook Lead Payload Handler (POST)
router.post('/', async (req, res) => {
  try {
    console.log('Webhook payload received:', req.body);

    // Extract relevant fields directly
    const parsedData = {
      first_name: req.body.first_name || '',
      last_name: req.body.last_name || '',
      email: req.body.email || '',
      phone: req.body.number1 || ''
    };

    await sendToFive9(parsedData);

    res.sendStatus(200);
  } catch (err) {
    console.error('Error processing webhook:', err.message);
    res.sendStatus(500);
  }
});

module.exports = router;