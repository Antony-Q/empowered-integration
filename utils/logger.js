const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '../logs');
if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH);

const logToFile = (filename, data) => {
  const file = path.join(LOG_PATH, filename);
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${JSON.stringify(data)}\n`;
  fs.appendFileSync(file, entry, 'utf8');
};

module.exports = {
  logLead: (campaign, payload) => logToFile(`${campaign}_leads.log`, payload),
  logError: (campaign, error) => logToFile(`${campaign}_errors.log`, error),
};