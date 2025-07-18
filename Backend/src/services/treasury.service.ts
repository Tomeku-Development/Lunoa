import { getPool } from '../config/database';
import logger from '../config/logger';

export interface DepositPayload {
  groupId: number;
  userId: string;
  amount: number;
  description?: string;
}

/**
 * Handles depositing funds into a group's treasury.
 * This function uses a transaction to ensure data integrity.
 * @param payload The deposit data.
 * @returns The newly created transaction record.
 */
export const depositToTreasury = async (payload: DepositPayload): Promise<any> => {
  const { groupId, userId, amount, description } = payload;

  const updateBalanceQuery = `
    UPDATE feed_groups
    SET treasury_balance = treasury_balance + $1
    WHERE id = $2;
  `;

  const logTransactionQuery = `
    INSERT INTO treasury_transactions (group_id, user_id, transaction_type, amount, description)
    VALUES ($1, $2, 'deposit', $3, $4)
    RETURNING *;
  `;

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Update the group's treasury balance
    await client.query(updateBalanceQuery, [amount, groupId]);

    // 2. Log the transaction
    const { rows } = await client.query(logTransactionQuery, [groupId, userId, amount, description]);

    await client.query('COMMIT'); // Commit transaction

    logger.info(`Deposit of ${amount} to group ${groupId} by user ${userId} successful.`);
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    logger.error(`Error depositing to treasury for group ${groupId}:`, error);
    throw new Error('Failed to make deposit.');
  } finally {
    client.release();
  }
};

/**
 * Retrieves the treasury balance for a specific group.
 * @param groupId The ID of the group.
 * @returns The treasury balance.
 */
export const getTreasuryBalance = async (groupId: number): Promise<number> => {
  const query = 'SELECT treasury_balance FROM feed_groups WHERE id = $1;';
  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [groupId]);
    if (rows.length === 0) {
      throw new Error('Group not found.');
    }
    return parseFloat(rows[0].treasury_balance);
  } catch (error) {
    logger.error(`Error fetching treasury balance for group ${groupId}:`, error);
    throw new Error('Failed to fetch treasury balance.');
  }
};

/**
 * Retrieves the transaction history for a group's treasury.
 * @param groupId The ID of the group.
 * @returns A list of transactions.
 */
export const getTreasuryTransactions = async (groupId: number): Promise<any[]> => {
  const query = 'SELECT * FROM treasury_transactions WHERE group_id = $1 ORDER BY created_at DESC;';
  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [groupId]);
    return rows;
  } catch (error) {
    logger.error(`Error fetching treasury transactions for group ${groupId}:`, error);
    throw new Error('Failed to fetch treasury transactions.');
  }
};
