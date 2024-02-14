import SpotifyAuth from '../../api/spotify-auth';
import { BrowserWindow } from 'electron';

jest.mock(
  'electron',
  () => {
    return { BrowserWindow: jest.fn() };
  },
  { virtual: true }
);

const auth = new SpotifyAuth(new BrowserWindow());

test('Creates a code verifier string', () => {
  const length = 64;
  const verifier = auth.generateCodeVerifier(length);
  expect(typeof verifier).toBe('string');
  expect(verifier).toHaveLength(length);
});

test('Creates a code challenge string', () => {
  const verifier = auth.generateCodeVerifier(64);
  const codeChallenge = auth.generateCodeChallenge(verifier);
  expect(typeof codeChallenge).toBe('string');
  expect(codeChallenge.length).toBeGreaterThan(0);
});