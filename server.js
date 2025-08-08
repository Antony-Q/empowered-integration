require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const leadRoutes = require('./routes/leads');
app.use('/api/leads', leadRoutes);

const simulateMetaLeadRoute = require('./routes/simulate-meta-lead');
app.use('/simulate-meta-lead', simulateMetaLeadRoute);

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Received GET webhook verification:', { mode, token, challenge });
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified by Meta');
    res.status(200).send(challenge);
  } else {
    console.warn('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/simulate-meta-lead', (req, res) => {
  const simulatedPayload = {
    object: 'page',
    entry: [
      {
        id: '123456789',
        time: Date.now(),
        changes: [
          {
            field: 'leadgen',
            value: {
              ad_id: 'fake_ad_001',
              form_id: 'fake_form_123',
              leadgen_id: 'sim_lead_001',
              created_time: Date.now(),
              page_id: '999999'
            }
          }
        ]
      }
    ]
  };

  console.log('🔥 Simulated Meta webhook triggered');
  console.log('Payload:', JSON.stringify(simulatedPayload, null, 2));

  // OPTIONAL: route this to the actual webhook logic
  // For example:
  handleMetaLead(simulatedPayload);

  res.send({ status: 'Simulated lead sent' });
});