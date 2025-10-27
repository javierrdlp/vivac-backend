export enum UserExperience {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export const UserExperienceLabels: Record<UserExperience, string> = {
  [UserExperience.BEGINNER]: 'Principiante',
  [UserExperience.INTERMEDIATE]: 'Intermedio',
  [UserExperience.ADVANCED]: 'Avanzado'  
};
