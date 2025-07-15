import Joi from 'joi';

export interface Quest {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  reward: number;
  currency: 'Lunoa' | 'USDC';
  type: 'social' | 'location_based';
  status: 'active' | 'completed' | 'expired';
  created_at: string;
  expires_at: string;
}

export const questSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  reward: Joi.number().positive().required(),
  currency: Joi.string().valid('Lunoa', 'USDC').required(),
  type: Joi.string().valid('social', 'location_based').required(),
  expires_at: Joi.date().iso().greater('now').required(),
});
