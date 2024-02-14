import crypto, { webcrypto } from 'crypto';
import { BrowserWindow, dialog } from 'electron';
import settings from "electron-settings";
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

class SpotifyAuth {
  port: string;
  redirectUri: string;
  scope: string | string[];
  codeVerifier: string;
  codeChallenge: string;
  clientId: string;
  window: BrowserWindow;

  constructor(window: BrowserWindow){
    this.port = PORT;
    this.redirectUri = REDIRECT_URI;
    this.scope = scope;
    this.codeVerifier = this.generateCodeVerifier(64);
    this.codeChallenge = this.generateCodeChallenge(this.codeVerifier);
    this.clientId = process.env.CLIENT_ID!;
    this.window = window;
  };

  authenticate(): void {
    this.window.loadURL(this.generateAuthUrl());

    http.createServer((req, res) => {
      const url = new URL(req.url!, `http://${req.headers.host}`);
    
      if(url.pathname === '/spotify'){
        this.handleSpotifyResponse(url);
      };
    }).listen(PORT);
  };

  generateAuthUrl(): string {
    const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
    
    const params =  {
      response_type: 'code',
      client_id: this.clientId,
      scope: scope.join(','),
      code_challenge_method: 'S256',
      code_challenge: this.codeChallenge,
      redirect_uri: this.redirectUri,
    };
  
    AUTH_URL.search = new URLSearchParams(params).toString();
    AUTH_URL.search = decodeURIComponent(AUTH_URL.search);
  
    return AUTH_URL.toString();
  };

  async handleSpotifyResponse(url: URL) {
    const error = url.searchParams.get('error');
  
    if(error) {
      this.window.close();
      dialog.showErrorBox(`Error: ${error}`, "Please restart the app and try again");
      return console.log(error);
    };
  
    const code = url.searchParams.get('code');
  
    if(code){
      await this.getToken(code);
      this.window.close();
    };
  };
  
  async getToken(code: string): Promise<void> {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        code_verifier: this.codeVerifier,
      }),
    };
  
    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();

    settings.setSync({
      token: {
        access: response.access_token,
        refresh: response.refresh_token
      }
    });
  };

  generateCodeVerifier(length: number): string {
    const possibleValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues: Uint8Array = webcrypto.getRandomValues(new Uint8Array(length));
    const codeVerifier: string = randomValues.reduce(
      (acc, x) => acc + possibleValues[x % possibleValues.length], 
      ""
    );
    
    return codeVerifier;
  };
  
  generateCodeChallenge(verifier: string): string {
    const hashed = this.sha256(verifier);
    const codeChallenge = this.base64encode(hashed);
    return codeChallenge;
  };
  
  private sha256(str: string): Buffer {
    return crypto
      .createHash("sha256")
      .update(str)
      .digest();
  };
  
  private base64encode(input: Buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };
};

export default SpotifyAuth;