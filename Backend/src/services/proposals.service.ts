import { getPool } from '../config/database';
import logger from '../config/logger';

export interface Proposal {
  id: number;
  group_id: number;
  creator_id: string;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'passed' | 'failed';
  created_at: Date;
  expires_at: Date;
}

export interface CreateProposalPayload {
  groupId: number;
  creatorId: string;
  title: string;
  description: string;
  durationDays: number;
}

/**
 * Creates a new proposal in the database.
 * @param proposalData The data for the new proposal.
 * @returns The newly created proposal.
 */
export const createProposal = async (proposalData: CreateProposalPayload): Promise<Proposal> => {
  const { groupId, creatorId, title, description, durationDays } = proposalData;

  // Calculate expires_at from duration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const query = `
    INSERT INTO proposals (group_id, creator_id, title, description, expires_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [groupId, creatorId, title, description, expiresAt]);
    logger.info(`Proposal created successfully with ID: ${rows[0].id} in group ${groupId}`);
    return rows[0];
  } catch (error) {
    logger.error(`Error creating proposal in group ${groupId}:`, error);
    throw error; // Re-throw for controller to handle
  }
};

/**
 * Retrieves a single proposal by its ID.
 * @param proposalId The ID of the proposal to retrieve.
 * @returns The proposal object or null if not found.
 */
export const getProposalById = async (proposalId: number): Promise<Proposal | null> => {
  const query = 'SELECT * FROM proposals WHERE id = $1';
  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [proposalId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`Error retrieving proposal ${proposalId}:`, error);
    throw error;
  }
};

/**
 * Casts a vote on a proposal.
 * @param proposalId The ID of the proposal being voted on.
 * @param voterId The ID of the user voting.
 * @param voteOption The vote itself (true for 'yes', false for 'no').
 * @returns The new vote record.
 */
export const castVote = async (proposalId: number, voterId: string, voteOption: boolean): Promise<any> => {
  const query = `
    INSERT INTO votes (proposal_id, voter_id, vote_option)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [proposalId, voterId, voteOption]);
    logger.info(`Vote cast successfully by ${voterId} on proposal ${proposalId}`);
    return rows[0];
  } catch (error) {
    logger.error(`Error casting vote for ${voterId} on proposal ${proposalId}:`, error);
    throw error; // Re-throw for controller to handle
  }
};
