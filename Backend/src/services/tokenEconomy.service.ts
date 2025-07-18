import { getPool } from '../config/database';
import logger from '../config/logger';
import { AptosService } from './aptos.service';

export interface TokenBalance {
  address: string;
  balance: number;
  lockedBalance: number;
  availableBalance: number;
  lastUpdated: Date;
}

export interface TokenTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  txHash?: string;
  description: string;
  metadata?: any;
  createdAt: Date;
  completedAt?: Date;
}

export enum TransactionType {
  QUEST_REWARD = 'quest_reward',
  QUEST_PAYMENT = 'quest_payment',
  VIBE_BOOST = 'vibe_boost',
  TRANSFER = 'transfer',
  STAKING_REWARD = 'staking_reward',
  GOVERNANCE_REWARD = 'governance_reward',
  SYSTEM_MINT = 'system_mint',
  MARKETPLACE_PURCHASE = 'marketplace_purchase'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface StakingInfo {
  address: string;
  stakedAmount: number;
  rewards: number;
  stakingPeriod: number;
  lastRewardClaim: Date;
  apy: number;
}

/**
 * Get token balance for a wallet address
 */
export const getTokenBalance = async (address: string): Promise<TokenBalance> => {
  const pool = getPool();
  
  try {
    // Get balance from our database cache
    const balanceQuery = `
      SELECT * FROM token_balances 
      WHERE address = $1 
      ORDER BY last_updated DESC 
      LIMIT 1
    `;
    
    const balanceResult = await pool.query(balanceQuery, [address]);
    
    if (balanceResult.rows.length === 0) {
      // If no cached balance, get from blockchain and cache it
      const aptosService = new AptosService();
      const blockchainBalance = await aptosService.getTokenBalance(address);
      
      // Cache the balance
      const insertQuery = `
        INSERT INTO token_balances (address, balance, locked_balance, available_balance)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const insertResult = await pool.query(insertQuery, [
        address,
        blockchainBalance,
        0, // locked_balance - to be calculated based on active stakes/commitments
        blockchainBalance
      ]);
      
      return insertResult.rows[0];
    }
    
    return balanceResult.rows[0];
  } catch (error) {
    logger.error(`Error retrieving token balance for ${address}:`, error);
    throw new Error('Failed to retrieve token balance');
  }
};

/**
 * Update token balance cache
 */
export const updateTokenBalance = async (
  address: string,
  balance: number,
  lockedBalance: number = 0
): Promise<TokenBalance> => {
  const pool = getPool();
  
  try {
    const query = `
      INSERT INTO token_balances (address, balance, locked_balance, available_balance)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (address) DO UPDATE SET
        balance = $2,
        locked_balance = $3,
        available_balance = $4,
        last_updated = NOW()
      RETURNING *
    `;
    
    const availableBalance = balance - lockedBalance;
    const result = await pool.query(query, [address, balance, lockedBalance, availableBalance]);
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating token balance for ${address}:`, error);
    throw new Error('Failed to update token balance');
  }
};

/**
 * Create a new token transaction record
 */
export const createTokenTransaction = async (
  from: string,
  to: string,
  amount: number,
  type: TransactionType,
  description: string,
  metadata?: any
): Promise<TokenTransaction> => {
  const pool = getPool();
  
  try {
    const query = `
      INSERT INTO token_transactions (from_address, to_address, amount, type, description, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      from,
      to,
      amount,
      type,
      description,
      JSON.stringify(metadata || {})
    ]);
    
    const transaction = result.rows[0];
    logger.info(`Token transaction created: ${type} - ${amount} from ${from} to ${to}`);
    
    return transaction;
  } catch (error) {
    logger.error(`Error creating token transaction:`, error);
    throw new Error('Failed to create token transaction');
  }
};

/**
 * Get token transaction history for an address
 */
export const getTokenTransactionHistory = async (
  address: string,
  limit: number = 50,
  offset: number = 0,
  type?: TransactionType
): Promise<{ transactions: TokenTransaction[], totalCount: number }> => {
  const pool = getPool();
  
  try {
    let whereClause = 'WHERE (from_address = $1 OR to_address = $1)';
    let params: any[] = [address];
    
    if (type) {
      whereClause += ' AND type = $2';
      params.push(type);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM token_transactions ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Get transactions with pagination
    const query = `
      SELECT *, 
        CASE WHEN from_address = $1 THEN 'outgoing' ELSE 'incoming' END as direction
      FROM token_transactions 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    params.push(limit, offset);
    const result = await pool.query(query, params);
    
    const transactions = result.rows.map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : {}
    }));
    
    return { transactions, totalCount };
  } catch (error) {
    logger.error(`Error retrieving transaction history for ${address}:`, error);
    throw new Error('Failed to retrieve transaction history');
  }
};

/**
 * Get platform token statistics
 */
export const getTokenStatistics = async () => {
  const pool = getPool();
  
  try {
    // Total tokens in circulation
    const circulationQuery = `
      SELECT COALESCE(SUM(balance), 0) as total_circulation
      FROM token_balances
    `;
    const circulationResult = await pool.query(circulationQuery);
    const totalCirculation = parseFloat(circulationResult.rows[0].total_circulation || '0');
    
    // Total rewards distributed
    const rewardsQuery = `
      SELECT COALESCE(SUM(amount), 0) as total_rewards
      FROM token_transactions
      WHERE type IN ('quest_reward', 'staking_reward', 'governance_reward')
      AND status = 'completed'
    `;
    const rewardsResult = await pool.query(rewardsQuery);
    const totalRewards = parseFloat(rewardsResult.rows[0].total_rewards || '0');
    
    // Active addresses (addresses with recent activity)
    const activeAddressesQuery = `
      SELECT COUNT(DISTINCT address) as active_addresses
      FROM token_balances
      WHERE last_updated >= NOW() - INTERVAL '30 days'
    `;
    const activeAddressesResult = await pool.query(activeAddressesQuery);
    const activeAddresses = parseInt(activeAddressesResult.rows[0].active_addresses || '0');
    
    // Transaction volume (last 30 days)
    const volumeQuery = `
      SELECT COALESCE(SUM(amount), 0) as volume_30d
      FROM token_transactions
      WHERE created_at >= NOW() - INTERVAL '30 days'
      AND status = 'completed'
    `;
    const volumeResult = await pool.query(volumeQuery);
    const volume30d = parseFloat(volumeResult.rows[0].volume_30d || '0');
    
    return {
      totalCirculation,
      totalRewards,
      activeAddresses,
      volume30d,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error retrieving token statistics:', error);
    throw new Error('Failed to retrieve token statistics');
  }
};

/**
 * Get staking information for an address
 */
export const getStakingInfo = async (address: string): Promise<StakingInfo | null> => {
  const pool = getPool();
  
  try {
    const query = `
      SELECT * FROM staking_positions
      WHERE address = $1 AND status = 'active'
    `;
    
    const result = await pool.query(query, [address]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Calculate current rewards
    const stakingPosition = result.rows[0];
    const now = new Date();
    const lastClaim = new Date(stakingPosition.last_reward_claim);
    const daysSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24);
    
    const dailyReward = (stakingPosition.staked_amount * stakingPosition.apy) / 365 / 100;
    const pendingRewards = dailyReward * daysSinceLastClaim;
    
    return {
      address,
      stakedAmount: parseFloat(stakingPosition.staked_amount),
      rewards: parseFloat(stakingPosition.accumulated_rewards) + pendingRewards,
      stakingPeriod: stakingPosition.staking_period,
      lastRewardClaim: lastClaim,
      apy: parseFloat(stakingPosition.apy)
    };
  } catch (error) {
    logger.error(`Error retrieving staking info for ${address}:`, error);
    throw new Error('Failed to retrieve staking information');
  }
};

/**
 * Process quest reward distribution
 */
export const distributeQuestReward = async (
  questId: string,
  recipientAddress: string,
  amount: number,
  creatorAddress: string
): Promise<TokenTransaction> => {
  const pool = getPool();
  
  try {
    // Create transaction record
    const transaction = await createTokenTransaction(
      creatorAddress,
      recipientAddress,
      amount,
      TransactionType.QUEST_REWARD,
      `Quest completion reward for quest ${questId}`,
      { questId }
    );
    
    // Update balances
    await updateTokenBalance(recipientAddress, 0); // This would trigger a blockchain balance refresh
    
    logger.info(`Quest reward distributed: ${amount} tokens to ${recipientAddress} for quest ${questId}`);
    
    return transaction;
  } catch (error) {
    logger.error(`Error distributing quest reward:`, error);
    throw new Error('Failed to distribute quest reward');
  }
};

/**
 * Get top token holders
 */
export const getTopTokenHolders = async (limit: number = 10) => {
  const pool = getPool();
  
  try {
    const query = `
      SELECT address, balance, last_updated
      FROM token_balances
      ORDER BY balance DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  } catch (error) {
    logger.error('Error retrieving top token holders:', error);
    throw new Error('Failed to retrieve top token holders');
  }
};
