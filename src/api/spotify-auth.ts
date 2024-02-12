import crypto, { webcrypto } from 'crypto';

function generateCodeVerifier(length: number): string {
  const possibleValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues: Uint8Array = webcrypto.getRandomValues(new Uint8Array(length));
  const codeVerifier: string = randomValues.reduce(
    (acc, x) => acc + possibleValues[x % possibleValues.length], 
    ""
  );
  
  return codeVerifier;
};

function generateCodeChallenge(verifier: string): string {
  const hashed = _sha256(verifier);
  const codeChallenge = _base64encode(hashed);
  return codeChallenge;
};

function _sha256(str: string): Buffer {
  return crypto
    .createHash("sha256")
    .update(str)
    .digest();
};

function _base64encode(input: Buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

function generateAuthUrl(clientId: string, codeChallenge: string, redirectUri: string): string {
  const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
  
  const scope = [
    "user-modify-playback-state",
    "user-read-playback-state",
    "user-library-read",
    "user-library-modify",
  ];
  
  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope: scope.join(','),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  AUTH_URL.search = new URLSearchParams(params).toString();
  AUTH_URL.search = decodeURIComponent(AUTH_URL.search);

  return AUTH_URL.toString();
};

export { generateCodeVerifier, generateCodeChallenge, generateAuthUrl };