const crypto = require('crypto');

function verifyGhlSignature(rawBodyBuffer, signatureB64) {
  const pub = (process.env.GHL_PUBLIC_KEY || '').replace(/\\n/g, '\n');
  if (!pub || !signatureB64) return false;
  try {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(rawBodyBuffer);
    verifier.end();
    return verifier.verify(pub, signatureB64, 'base64');
  } catch {
    return false;
  }
}
module.exports = { verifyGhlSignature };