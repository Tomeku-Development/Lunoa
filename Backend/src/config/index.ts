import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Aptos Configuration
  aptosNetwork: process.env.APTOS_NETWORK,
  aptosContractAddress: process.env.APTOS_CONTRACT_ADDRESS,
  aptosServiceAccountPrivateKey: process.env.APTOS_SERVICE_ACCOUNT_PRIVATE_KEY,

  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataApiSecret: process.env.PINATA_API_SECRET,
};

export default config;
