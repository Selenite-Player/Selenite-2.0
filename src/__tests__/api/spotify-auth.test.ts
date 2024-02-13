import { 
  generateCodeVerifier, 
  generateCodeChallenge, 
} from '../../api/spotify-auth';

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