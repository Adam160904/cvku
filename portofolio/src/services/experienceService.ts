import type { Experience } from '../types';
import { createCrudService } from './crud';

const crud = createCrudService<Experience>({ table: 'experiences', orderBy: 'start_date' });

export const experienceService = {
  getExperiences: (userId: string) => crud.list(userId),
  addExperience: (userId: string, data: Omit<Experience, 'id' | 'user_id'>) => crud.create(userId, data),
  updateExperience: (userId: string, id: string, data: Partial<Experience>) => crud.update(userId, id, data),
  deleteExperience: (userId: string, id: string) => crud.remove(userId, id),
};
