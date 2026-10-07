import { toFriendlyError } from '../lib/errors';
import {
  DEMO_PROFILE,
  DEMO_EDUCATIONS,
  DEMO_SKILLS,
  DEMO_EXPERIENCES,
  DEMO_PORTFOLIOS,
  DEMO_HOBBIES,
  DEMO_SOCIAL_LINKS,
} from '../utils/demoData';
import { profileService } from './profileService';
import { educationService } from './educationService';
import { skillService } from './skillService';
import { experienceService } from './experienceService';
import { portfolioService } from './portfolioService';
import { hobbyService } from './hobbyService';
import { socialService } from './socialService';

/**
 * Mengisi akun yang sedang login dengan contoh data (tersimpan sungguhan di
 * Supabase). Hanya mengisi bagian yang masih kosong, jadi data milik user
 * tidak pernah tertimpa dan username tidak diubah.
 */
export const demoService = {
  async seed(userId: string): Promise<void> {
    try {
      const [profile, edu, skills, exp, ports, hobbies, socials] = await Promise.all([
        profileService.getProfile(userId),
        educationService.getEducations(userId),
        skillService.getSkills(userId),
        experienceService.getExperiences(userId),
        portfolioService.getPortfolios(userId),
        hobbyService.getHobbies(userId),
        socialService.getSocialLinks(userId),
      ]);

      const tasks: Promise<unknown>[] = [];

      if (!profile || (!profile.headline && !profile.about)) {
        tasks.push(
          profileService.updateProfile(userId, {
            headline: DEMO_PROFILE.headline,
            about: DEMO_PROFILE.about,
            location: DEMO_PROFILE.location,
            phone: DEMO_PROFILE.phone,
            website: DEMO_PROFILE.website,
          }),
        );
      }
      if (edu.length === 0) tasks.push(...DEMO_EDUCATIONS.map((d) => educationService.addEducation(userId, d)));
      if (skills.length === 0) tasks.push(...DEMO_SKILLS.map((d) => skillService.addSkill(userId, d)));
      if (exp.length === 0) tasks.push(...DEMO_EXPERIENCES.map((d) => experienceService.addExperience(userId, d)));
      if (ports.length === 0) tasks.push(...DEMO_PORTFOLIOS.map((d) => portfolioService.addPortfolio(userId, d)));
      if (hobbies.length === 0) tasks.push(...DEMO_HOBBIES.map((d) => hobbyService.addHobby(userId, d)));
      if (socials.length === 0) tasks.push(...DEMO_SOCIAL_LINKS.map((d) => socialService.addSocialLink(userId, d)));

      await Promise.all(tasks);
    } catch (err) {
      throw toFriendlyError(err, 'Gagal mengisi data demo.');
    }
  },
};
