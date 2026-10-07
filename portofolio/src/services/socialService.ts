import type { SocialLink } from '../types';
import { createCrudService } from './crud';
import { normalizeUrl } from '../utils/url';

const crud = createCrudService<SocialLink>({
  table: 'social_links',
  orderBy: 'created_at',
  ascending: true,
});

export const socialService = {
  getSocialLinks: (userId: string) => crud.list(userId),
  addSocialLink: (userId: string, data: Omit<SocialLink, 'id' | 'user_id'>) => crud.create(userId, { ...data, url: normalizeUrl(data.url) }),
  updateSocialLink: (userId: string, id: string, data: Partial<SocialLink>) => crud.update(userId, id, data.url !== undefined ? { ...data, url: normalizeUrl(data.url) } : data),
  deleteSocialLink: (userId: string, id: string) => crud.remove(userId, id),
};
