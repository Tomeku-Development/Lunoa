import request from 'supertest';
import { app } from '../../../../app';
import { Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

describe('POST /api/v1/auth/logout', () => {
  let refreshTokenCookie: string;

  beforeAll(async () => {
    // 1. Connect a wallet to get a refresh token cookie
    const privateKey = Ed25519PrivateKey.generate();
    const publicKey = privateKey.publicKey();
    const walletAddress = publicKey.toString();
    const message = 'Welcome to Lunoa! Please sign this message to authenticate.';
    const signature = privateKey.sign(message).toString();

    const response = await request(app)
      .post('/api/v1/auth/connect')
      .send({ walletAddress, signature, message, walletProvider: 'petra' });

    // Extract the refreshToken cookie from the response headers
    const cookiesHeader = response.headers['set-cookie'];
    if (cookiesHeader) {
      const cookies = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];
      const cookie = cookies.find((c: string) => c.startsWith('refreshToken='));
      if (cookie) {
        refreshTokenCookie = cookie;
      }
    }
  });

  it('should clear the refreshToken cookie on logout', async () => {
    if (!refreshTokenCookie) {
      throw new Error('Refresh token cookie not set');
    }

    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', refreshTokenCookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Logout successful');

    // Check that the set-cookie header clears the cookie
    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toContain('refreshToken=;');
    expect(setCookieHeader[0]).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });
});
