import { getPool } from '../config/database';
import logger from '../config/logger';

export interface FeedGroup {
  id: number;
  name: string;
  description: string;
  creator_id: string;
  created_at: Date;
}

export interface CreateGroupPayload {
  name: string;
  description: string;
  creatorId: string;
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
}

/**
 * Creates a new feed group in the database.
 * @param groupData - The data for the new group.
 * @returns The newly created feed group.
 */
export const createGroup = async (groupData: CreateGroupPayload): Promise<FeedGroup> => {
  const { name, description, creatorId } = groupData;
  logger.info(`Creating new feed group with name: ${name}`);

  const createGroupQuery = `
    INSERT INTO feed_groups (name, description, creator_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const addMemberQuery = `
    INSERT INTO feed_group_members (group_id, user_id, role)
    VALUES ($1, $2, 'creator');
  `;

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Create the group
    const { rows: groupRows } = await client.query(createGroupQuery, [name, description, creatorId]);
    const newGroup = groupRows[0];

    // 2. Add the creator as a member with the 'creator' role
    await client.query(addMemberQuery, [newGroup.id, creatorId]);

    await client.query('COMMIT'); // Commit transaction

    logger.info(`Feed group created successfully with ID: ${newGroup.id}`);
    return newGroup;
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    logger.error('Error creating feed group in database:', error);
    throw new Error('Failed to create feed group.');
  } finally {
    client.release();
  }
};

/**
 * Retrieves all feed groups from the database.
 */
export const getAllGroups = async (): Promise<FeedGroup[]> => {
  const query = 'SELECT * FROM feed_groups ORDER BY created_at DESC;';

  try {
    const pool = getPool();
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    logger.error('Error fetching all feed groups:', error);
    throw new Error('Failed to fetch feed groups.');
  }
};

/**
 * Retrieves a single feed group by its ID.
 */
export const getGroupById = async (id: number): Promise<FeedGroup | null> => {
  const query = 'SELECT * FROM feed_groups WHERE id = $1;';

  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`Error fetching feed group with ID ${id}:`, error);
    throw new Error('Failed to fetch feed group.');
  }
};

/**
 * Updates an existing feed group.
 */
export const updateGroup = async (id: number, groupData: UpdateGroupPayload): Promise<FeedGroup | null> => {
  const { name, description } = groupData;
  const fields: string[] = [];
  const values: any[] = [];
  let queryIndex = 1;

  if (name) {
    fields.push(`name = $${queryIndex++}`);
    values.push(name);
  }

  if (description) {
    fields.push(`description = $${queryIndex++}`);
    values.push(description);
  }

  if (fields.length === 0) {
    // Nothing to update, just return the current group data
    return getGroupById(id);
  }

  values.push(id);

  const query = `
    UPDATE feed_groups
    SET ${fields.join(', ')}
    WHERE id = $${queryIndex}
    RETURNING *;
  `;

  try {
    const pool = getPool();
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  } catch (error) {
    logger.error(`Error updating feed group with ID ${id}:`, error);
    throw new Error('Failed to update feed group.');
  }
};

/**
 * Deletes a feed group from the database.
 */
export const deleteGroup = async (id: number): Promise<void> => {
  const query = 'DELETE FROM feed_groups WHERE id = $1;';

  try {
    const pool = getPool();
    await pool.query(query, [id]);
  } catch (error) {
    logger.error(`Error deleting feed group with ID ${id}:`, error);
    throw new Error('Failed to delete feed group.');
  }
};

/**
 * Checks if a user is a member of a specific group.
 */
export const isMember = async (groupId: number, userId: string): Promise<boolean> => {
  const query = 'SELECT 1 FROM feed_group_members WHERE group_id = $1 AND user_id = $2;';
  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [groupId, userId]);
    return rows.length > 0;
  } catch (error) {
    logger.error(`Error checking membership for user ${userId} in group ${groupId}:`, error);
    throw new Error('Failed to check group membership.');
  }
};

/**
 * Adds a user to a feed group.
 */
export const joinGroup = async (groupId: number, userId: string): Promise<void> => {
  const query = `INSERT INTO feed_group_members (group_id, user_id, role) VALUES ($1, $2, 'member');`;
  try {
    const pool = getPool();
    await pool.query(query, [groupId, userId]);
    logger.info(`User ${userId} successfully joined group ${groupId}`);
  } catch (error) {
    logger.error(`Error joining group ${groupId} for user ${userId}:`, error);
    // Re-throw the original error so the controller can inspect it for specific codes
    throw error;
  }
};

/**
 * Removes a user from a feed group.
 */
export const leaveGroup = async (groupId: number, userId: string): Promise<void> => {
  const query = 'DELETE FROM feed_group_members WHERE group_id = $1 AND user_id = $2;';
  try {
    const pool = getPool();
    await pool.query(query, [groupId, userId]);
  } catch (error) {
    logger.error(`Error removing user ${userId} from group ${groupId}:`, error);
    throw new Error('Failed to leave feed group.');
  }
};

/**
 * Retrieves all members of a specific feed group.
 */
export const getGroupMembers = async (groupId: number): Promise<any[]> => {
  const query = `
    SELECT user_id, role, joined_at
    FROM feed_group_members
    WHERE group_id = $1;
  `;
  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [groupId]);
    return rows;
  } catch (error) {
    logger.error(`Error retrieving members for group ${groupId}:`, error);
    throw new Error('Failed to retrieve group members.');
  }
};

/**
 * Updates the role of a member in a feed group.
 * @param groupId The ID of the group.
 * @param userId The ID of the user whose role is to be updated.
 * @param role The new role to assign.
 * @returns The updated membership record.
 */
export const updateMemberRole = async (groupId: number, userId: string, role: string): Promise<any> => {
  const query = `
    UPDATE feed_group_members 
    SET role = $1 
    WHERE group_id = $2 AND user_id = $3 
    RETURNING *;
  `;
  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [role, groupId, userId]);
    if (rows.length === 0) {
      // This can happen if the member does not exist in the group.
      throw new Error('Member not found in the specified group.');
    }
    logger.info(`Updated role for user ${userId} in group ${groupId} to ${role}`);
    return rows[0];
  } catch (error) {
    logger.error(`Error updating role for user ${userId} in group ${groupId}:`, error);
    // Re-throw the original error if it's our custom 'Member not found' error
    if (error instanceof Error && error.message === 'Member not found in the specified group.') {
        throw error;
    }
    throw new Error('Failed to update member role.');
  }
};
