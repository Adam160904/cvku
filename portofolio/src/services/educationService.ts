import type { Education } from '../types';
import { createCrudService } from './crud';

const crud = createCrudService<Education>({ table: 'educations', orderBy: 'start_year' });

export const educationService = {
  getEducations: (userId: string) => crud.list(userId),
  addEducation: (userId: string, data: Omit<Education, 'id' | 'user_id'>) => crud.create(userId, data),
  updateEducation: (userId: string, id: string, data: Partial<Education>) => crud.update(userId, id, data),
  deleteEducation: (userId: string, id: string) => crud.remove(userId, id),
};
