import type { Portfolio } from '../types';
import { createCrudService } from './crud';
import { storageService } from './storageService';
import { normalizeUrl } from '../utils/url';

function cleanUrls<T extends { project_url?: string; github_url?: string }>(data: T): T {
  const copy = { ...data };
  if (copy.project_url !== undefined) copy.project_url = normalizeUrl(copy.project_url);
  if (copy.github_url !== undefined) copy.github_url = normalizeUrl(copy.github_url);
  return copy;
}

const crud = createCrudService<Portfolio>({ table: 'portfolios', orderBy: 'created_at' });

export const portfolioService = {
  getPortfolios: (userId: string) => crud.list(userId),
  addPortfolio: (userId: string, data: Omit<Portfolio, 'id' | 'user_id'>) => crud.create(userId, cleanUrls(data)),
  updatePortfolio: (userId: string, id: string, data: Partial<Portfolio>) => crud.update(userId, id, cleanUrls(data)),
  deletePortfolio: (userId: string, id: string) => crud.remove(userId, id),
  uploadPortfolioImage: (userId: string, file: File) =>
    storageService.uploadImage('portfolio-images', userId, file, 'project', 8),
};
