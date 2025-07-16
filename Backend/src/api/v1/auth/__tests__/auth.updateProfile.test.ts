import request from 'supertest';
import { app } from '../../../../app';
import { Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

describe('PUT /api/v1/auth/profile', () => {
  let token: string;

  beforeAll(async () => {
    // 1. Connect a wallet to get a token
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

  it('should update the user profile', async () => {
    const newProfileData = {
      bio: 'This is my new bio.',
      website: 'https://example.com',
      location: 'San Francisco',
    };

    const response = await request(app)
      .put('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(newProfileData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Profile updated successfully.');

    // Verify the changes
    const profileResponse = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('bio', newProfileData.bio);
    expect(profileResponse.body).toHaveProperty('website', newProfileData.website);
    expect(profileResponse.body).toHaveProperty('location', newProfileData.location);
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).put('/api/v1/auth/profile');

    expect(response.status).toBe(401);
  });
});
