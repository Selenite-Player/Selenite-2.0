import crypto, { webcrypto } from 'crypto';
import http from 'http';

require('dotenv').config();

const PORT = "8888";
const REDIRECT_URI = `http://localhost:${PORT}/spotify`;

const scope = [
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-library-read",
  "user-library-modify",
];
const codeVerifier = generateCodeVerifier(64);
const codeChallenge = generateCodeChallenge(codeVerifier);
let clientId = process.env.CLIENT_ID!;

http.createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  if(url.pathname === '/callback'){
    handleSpotifyResponse(url);
  };
}).listen(PORT);

function handleSpotifyResponse(url: URL) {
  const error = url.searchParams.get('error');

  if(error) {
    return console.log(error);
  };

  const code = url.searchParams.get('code');

  if(code){
    getToken(code);
  };
};

async function getToken(code: string): Promise<{
  accessToken: any;
  refreshToken: any;
}> {
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch("https://accounts.spotify.com/api/token", payload);
  const response = await body.json();

  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token
  };
};

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

function generateAuthUrl(): string {
  const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
  
  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope: scope.join(','),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  AUTH_URL.search = new URLSearchParams(params).toString();
  AUTH_URL.search = decodeURIComponent(AUTH_URL.search);

  return AUTH_URL.toString();
};

export { generateCodeVerifier, generateCodeChallenge, generateAuthUrl };