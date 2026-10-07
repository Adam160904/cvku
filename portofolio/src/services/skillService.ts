import type { Skill } from '../types';
import { createCrudService } from './crud';

const crud = createCrudService<Skill>({ table: 'skills', orderBy: 'percentage' });

export const skillService = {
  getSkills: (userId: string) => crud.list(userId),
  addSkill: (userId: string, data: Omit<Skill, 'id' | 'user_id'>) => crud.create(userId, data),
  updateSkill: (userId: string, id: string, data: Partial<Skill>) => crud.update(userId, id, data),
  deleteSkill: (userId: string, id: string) => crud.remove(userId, id),
};
