const axios = require('axios');

async function sendToFive9(payload) {
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
        'Authorization': `Basic ${process.env.FIVE9_AUTH}` // from your .env
      }
    });

    console.log('✅ Lead sent to Five9:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending lead to Five9:', error.response?.data || error.message);
    return null;
  }
}

module.exports = sendToFive9;