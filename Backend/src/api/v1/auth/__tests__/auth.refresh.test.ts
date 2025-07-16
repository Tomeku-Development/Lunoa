import request from 'supertest';
import { app } from '../../../../app';
import { Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

describe('POST /api/v1/auth/refresh', () => {
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

  it('should return a new access token for a valid refresh token', async () => {
    if (!refreshTokenCookie) {
      throw new Error('Refresh token cookie not set');
    }

    const response = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', refreshTokenCookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('should return 401 if no refresh token is provided', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refresh');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Refresh token not found.');
  });
});
