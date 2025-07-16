import request from 'supertest';
import { app } from '../../../../app';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

describe('POST /api/v1/auth/verify', () => {
  let token: string;

  beforeAll(async () => {
    // 1. Generate a new Aptos account and get a token
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

  it('should return 200 for a valid token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Token is valid');
  });

  it('should return 401 for an invalid token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
  });

  it('should return 401 for a missing token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify');

    expect(response.status).toBe(401);
  });
});
