import request from 'supertest';
import { app } from '../../../../app';
import { Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

describe('DELETE /api/v1/auth/profile', () => {
  let token: string;

  beforeEach(async () => {
    // A new user and token are needed for each test to ensure isolation
    const privateKey = Ed25519PrivateKey.generate();
    const publicKey = privateKey.publicKey();
    const walletAddress = publicKey.toString();
    const message = 'Welcome to Lunoa! Please sign this message to authenticate.';
    const signature = privateKey.sign(message).toString();

    const response = await request(app)
      .post('/api/v1/auth/connect')
      .send({ walletAddress, signature, message, walletProvider: 'petra' });

    token = response.body.accessToken;
  });

  it('should delete the user account and clear the cookie', async () => {
    const response = await request(app)
      .delete('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Account deleted successfully.');

    // Verify the cookie is cleared
    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toContain('refreshToken=;');
    expect(setCookieHeader[0]).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    // Verify the user can no longer access their profile
    const profileResponse = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(401); // or 404, depending on middleware order
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).delete('/api/v1/auth/profile');

    expect(response.status).toBe(401);
  });
});
