import type { Hobby } from '../types';
import { createCrudService } from './crud';

const crud = createCrudService<Hobby>({
  table: 'hobbies',
  orderBy: 'created_at',
  ascending: true,
  hasUpdatedAt: false,
});

export const hobbyService = {
  getHobbies: (userId: string) => crud.list(userId),
  addHobby: (userId: string, data: Omit<Hobby, 'id' | 'user_id'>) => crud.create(userId, data),
  updateHobby: (userId: string, id: string, data: Partial<Hobby>) => crud.update(userId, id, data),
  deleteHobby: (userId: string, id: string) => crud.remove(userId, id),
};
