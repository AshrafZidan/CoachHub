export interface FilterLookupItem {
  id: number;
  nameEn: string;
  nameAr: string;
  code?: string;
}

export type CoachGender =
  | 'MALE'
  | 'FEMALE'
  | null;

export type CoachExperience =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'EXPERT'
  | null;

export interface CoachFilterValue {
  industryIds: number[];
  languageIds: number[];
  gender: CoachGender;
  experience: CoachExperience;
}