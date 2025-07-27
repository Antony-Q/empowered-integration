// utils/five9.js
const axios = require('axios');

// Replace with your real Five9 values
const FIVE9_DOMAIN = 'Empowered Aesthetic Solutions'; // Case-sensitive
const LIST_NAME = 'Island ENT-Exomind'; // Must match Five9 exactly
const FIVE9_USERNAME = process.env.FIVE9_USERNAME;
const FIVE9_PASSWORD = process.env.FIVE9_PASSWORD;

/**
 * Formats Meta lead data and sends it to Five9
 * @param {Object} leadData - Parsed data from Meta webhook
 * @returns {Promise<void>}
 */
async function sendToFive9(leadData) {
  const { first_name, last_name, email, phone } = leadData;

  const payload = {
    domain: FIVE9_DOMAIN,
    list: LIST_NAME,
    contacts: [
      {
        firstName: first_name || '',
        lastName: last_name || '',
        email: email || '',
        phoneNumber: phone || '',
      },
    ],
  };

  try {
    const response = await axios.post(
    'https://api.five9.com/web2campaign/AddContact',
      payload,
      {
        auth: {
          username: FIVE9_USERNAME,
          password: FIVE9_PASSWORD,
        },
        headers: {
          'Content-Type': 'application/json',
        },
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