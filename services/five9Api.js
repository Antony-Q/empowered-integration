const axios = require('axios');
const { logLead, logError } = require('../utils/logger');

async function sendToFive9(campaignName, payload) {
  const auth = {
    username: process.env.FIVE9_USERNAME,
    password: process.env.FIVE9_PASSWORD
  };

  try {
    const response = await axios.post(
      'https://api.five9.com/web2campaign/AddToList',
      payload,
      {
        auth,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }
    );

    logLead(campaignName, { payload, response: response.data });
    console.log('✅ Lead sent to Five9:', response.data);
    return response.data;
  } catch (error) {
    const errDetails = error.response?.data || error.message;
    logError(campaignName, { payload, error: errDetails });
    console.error('❌ Five9 error:', errDetails);
    throw error;
  }
}

module.exports = sendToFive9;