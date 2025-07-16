import request from 'supertest';
import { app } from '../../../../app';
import { Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

describe('GET /api/v1/auth/profile', () => {
  let token: string;
  let walletAddress: string;

  beforeAll(async () => {
    // 1. Connect a wallet to get a token
    const privateKey = Ed25519PrivateKey.generate();
    const publicKey = privateKey.publicKey();
    walletAddress = publicKey.toString();
    const message = 'Welcome to Lunoa! Please sign this message to authenticate.';
    const signature = privateKey.sign(message).toString();

    const response = await request(app)
      .post('/api/v1/auth/connect')
      .send({ walletAddress, signature, message, walletProvider: 'petra' });

    token = response.body.accessToken;
  });

  it('should return the user profile for a valid token', async () => {
    const response = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('walletAddress', walletAddress);
    expect(response.body).not.toHaveProperty('password_hash');
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/api/v1/auth/profile');

    expect(response.status).toBe(401);
  });
});
