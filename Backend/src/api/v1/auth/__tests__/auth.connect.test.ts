import request from 'supertest';
import { app } from '../../../../app';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

describe('POST /api/v1/auth/connect', () => {
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  it('should connect a wallet and return a JWT for a new user', async () => {
    // 1. Generate a new Aptos account
    const privateKey = Ed25519PrivateKey.generate();
    const publicKey = privateKey.publicKey();
    const walletAddress = publicKey.toString();

    // 2. Sign a message
    const message = 'Welcome to Lunoa! Please sign this message to authenticate.';
    const signature = privateKey.sign(message).toString();

    // 3. Send the request to the endpoint
    const response = await request(app)
      .post('/api/v1/auth/connect')
      .send({ walletAddress, signature, message, walletProvider: 'petra' });

    // 4. Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('should return 401 for an invalid signature', async () => {
    const privateKey = Ed25519PrivateKey.generate();
    const publicKey = privateKey.publicKey();
    const walletAddress = publicKey.toString();

    const message = 'Welcome to Lunoa! Please sign this message to authenticate.';
    const invalidSignature = '0x' + 'a'.repeat(128); // An obviously invalid signature

    const response = await request(app)
      .post('/api/v1/auth/connect')
      .send({ walletAddress, signature: invalidSignature, message });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid signature');
  });

  it('should return 400 for missing parameters', async () => {
    const response = await request(app)
      .post('/api/v1/auth/connect')
      .send({ walletAddress: '0x123' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing walletAddress, signature, or message');
  });

  it('should return 400 if an invalid walletProvider is provided', async () => {
    const privateKey = Ed25519PrivateKey.generate();
    const publicKey = privateKey.publicKey();
    const walletAddress = publicKey.toString();
    const message = 'Welcome to Lunoa! Please sign this message to authenticate.';
    const signature = privateKey.sign(message).toString();

    const response = await request(app)
      .post('/api/v1/auth/connect')
      .send({ walletAddress, signature, message, walletProvider: 'invalid_wallet' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', '"walletProvider" must be one of [petra, martian, other]');
  });
});
