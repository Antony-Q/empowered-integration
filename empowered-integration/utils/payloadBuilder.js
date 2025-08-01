const qs = require('qs');

function buildFive9Payload(data, config) {
  const payload = {
    F9domain: process.env.FIVE9_DOMAIN,
    F9list: config.list,
    F9key: 'number1',
    F9CallASAP: config.F9CallASAP ? 'true' : 'false',
    F9updateCRM: config.F9updateCRM ? 'true' : 'false',
    F9retResults: 'true'
  };

  config.fields.forEach((field) => {
    payload[field] = data[field] || '';
  });

  return qs.stringify(payload);
}

module.exports = buildFive9Payload;