// utils/five9.js
const axios = require('axios');
const qs = require('qs');

// Replace with your real Five9 values
const FIVE9_DOMAIN = 'Empowered Aesthetic Solutions'; // Case-sensitive
const LIST_NAME = 'Island ENT-Exomind'; // Must match Five9 exactly
const FIVE9_USERNAME = process.env.FIVE9_USERNAME;
const FIVE9_PASSWORD = process.env.FIVE9_PASSWORD;

async function sendToFive9(leadData) {
  const { first_name, last_name, email, phone } = leadData;

  const payload = qs.stringify({
    F9domain: FIVE9_DOMAIN,
    F9list: LIST_NAME,
    F9key: 'number1', // required for deduplication logic
    number1: phone || '',
    first_name: first_name || '',
    last_name: last_name || '',
    email: email || '',
    F9updateCRM: true,
    F9retResults: true,
    F9CallASAP: true
  });

  try {
    const response = await axios.post(
      'https://api.five9.com/web2campaign/AddToList',
      payload,
      {
        auth: {
          username: FIVE9_USERNAME,
          password: FIVE9_PASSWORD
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }
    );

    console.log('✅ Lead sent to Five9:', response.data);
  } catch (error) {
    console.error('❌ Error sending lead to Five9:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

module.exports = { sendToFive9 };