const axios = require('axios');

async function sendToFive9(payload) {
    
    const codeDescriptions = {
  0: 'Success – Lead accepted',
  600: 'Missing field in CRM table',
  602: 'Record already existed – added to list',
  603: 'Record already exists in list – not added',
  700: 'Missing required field',
  708: 'Multiple records matched F9Key',
  709: 'No key provided',
  710: 'Time format required with Time to Dial',
  711: 'Invalid time to dial',
  712: 'Invalid key field name',
  713: 'Field value too long',
  714: 'Incorrect field format',
  715: 'Too many requests – rate limit hit',
  716: 'Domain disabled',
  718: 'Domain not found',
};

  const {
    F9domain,
    F9list,
    F9key,
    number1,
    first_name,
    last_name,
    email,
    F9updateCRM,
    F9retResults,
    F9CallASAP
  } = payload;

  const five9Url = 'https://api.five9.com/web2campaign/AddToList';

  const params = new URLSearchParams();
  params.append('F9domain', F9domain);
  params.append('F9list', F9list);
  params.append('F9key', F9key);
  params.append('number1', number1);
  params.append('first_name', first_name);
  params.append('last_name', last_name);
  params.append('email', email);
  params.append('F9updateCRM', F9updateCRM);
  params.append('F9retResults', F9retResults);
  params.append('F9CallASAP', F9CallASAP);

  try {
    const response = await axios.post(five9Url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${process.env.FIVE9_AUTH}` // from .env file
      }
    });

    const rawResponse = response.data;

console.log('✅ Five9 raw response:', rawResponse);

// Try to extract result codes from the return string
const errCodeMatch = rawResponse.match(/F9errCode=(\d+)/);
const errDescMatch = rawResponse.match(/F9errDesc="([^"]+)"/);

if (errCodeMatch) {
  const code = errCodeMatch[1];
  const desc = errDescMatch ? errDescMatch[1] : 'No description provided';

  if (code === '0') {
    console.log('🎉 Success: Lead accepted by Five9');
  } else {
    const friendlyDesc = codeDescriptions[code] || 'Unknown error';
    console.log(`⚠️ Five9 returned error code ${code}: ${desc} (${friendlyDesc})`);

  }
} else {
  console.log('❓ Unexpected response format from Five9');
}

    return response.data;
  } catch (error) {
    console.error('❌ Error sending lead to Five9:', error.response?.data || error.message);
    return null;
  }
}

module.exports = sendToFive9;