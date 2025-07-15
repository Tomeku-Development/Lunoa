import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { updateProfile } from '../auth.controller'; // Import the controller directly
import pool from '../../../../config/database';

// Mock the database module
jest.mock('../../../../config/database', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn(),
  },
}));

// Mock middleware function
const mockProtect = (req: Request, res: Response, next: NextFunction) => {
  req.user = { userId: '1' };
  next();
};

const app = express();
app.use(express.json());
// Apply the controller and mock middleware directly to a test route
app.put('/profile', mockProtect, updateProfile);

// Cast the imported pool to its mocked type
const mockedPool = pool as jest.Mocked<typeof pool>;

describe('Auth Controller - PUT /profile', () => {
  beforeEach(() => {
    (mockedPool.query as jest.Mock).mockClear();
  });

  it('should update user profile with a valid aptosAddress', async () => {
    const mockAptosAddress = '0x' + 'a'.repeat(64);

    // Mock the database query for the update
    (mockedPool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });

    const response = await request(app)
      .put('/profile') // Use the direct route
      .send({ aptosAddress: mockAptosAddress });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile updated successfully.');
    expect(mockedPool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users SET aptos_address = $1'),
      [mockAptosAddress, '1']
    );
  });

  it('should return 400 for an invalid aptosAddress', async () => {
    const response = await request(app)
      .put('/profile') // Use the direct route
      .send({ aptosAddress: 'invalid-address' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('aptosAddress');
    expect(mockedPool.query).not.toHaveBeenCalled();
  });
});
