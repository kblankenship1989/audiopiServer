import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64url';
import {randomBytes} from 'crypto';

export const generateVerifier = async () => {
  const buf = await randomBytes(40);
  return buf.toString('hex');
}

export const challenge_from_verifier = async (v) => {
  var hashed = await sha256(v);
  return Base64.stringify(hashed);
}

export const getStateValue = async () => {
  return await randomBytes(128).toString('hex');
};