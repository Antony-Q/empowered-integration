const axios = require('axios');

async function postToFive9(params) {
  const base = process.env.FIVE9_BASE_URL || 'https://api.five9.com';
  const url = `${base}/web2campaign/AddToList`;
  const creds = `${process.env.FIVE9_USER}:${process.env.FIVE9_PASS}`;
  const auth = Buffer.from(creds).toString('base64');
  const body = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => body.append(k, v));
  const res = await axios.post(url, body.toString(), {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    timeout: 15000
  });
  return { status: res.status, data: res.data };
}
module.exports = { postToFive9 };