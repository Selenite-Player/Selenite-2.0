import { 
  generateCodeVerifier, 
  generateCodeChallenge, 
  generateAuthUrl 
} from '../../api/spotify';

test('Creates a code verifier string', () => {
  const length = 64;
  const verifier = generateCodeVerifier(length);
  expect(typeof verifier).toBe('string');
  expect(verifier).toHaveLength(length);
});

test('Creates a code challenge string', () => {
  const verifier = generateCodeVerifier(64);
  const codeChallenge = generateCodeChallenge(verifier);
  expect(typeof codeChallenge).toBe('string');
  expect(codeChallenge.length).toBeGreaterThan(0);
});

test('Generates correct authorization URL', () => {
  const verifier = generateCodeVerifier(64);
  const codeChallenge = generateCodeChallenge(verifier);
  const clientId = '123';
  const redirectUri = "http://localhost:8888/callback";
  const correctUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=user-modify-playback-state,user-read-playback-state,user-library-read,user-library-modify&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=${redirectUri}`;

  const url = generateAuthUrl(clientId, codeChallenge, redirectUri);
  expect(url).toEqual(correctUrl);
});