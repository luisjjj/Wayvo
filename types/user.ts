import { User, WaverProfile, BrandProfile } from './database';

export type UserType = 'waver' | 'brand' | 'both';

export interface UserWithProfile extends User {
  waver_profile?: WaverProfile;
  brand_profile?: BrandProfile;
}

export interface WaverWithUser extends WaverProfile {
  users: User;
}

export interface BrandWithUser extends BrandProfile {
  users: User;
}

export type ActiveMode = 'waver' | 'brand';
