require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
  verify: (req, _res, buf) => { req.rawBody = buf; }
}));

const ghlRoutes = require('./server/webhook');
app.use('/ghl', ghlRoutes);

const leadRoutes = require('./routes/leads');
app.use('/api/leads', leadRoutes);

/* const simulateMetaLeadRoute = require('./routes/simulate-meta-lead');
app.use('/simulate-meta-lead', simulateMetaLeadRoute); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));