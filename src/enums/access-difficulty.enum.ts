export enum AccessDifficulty {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  HARD = 'HARD'  
}

export const AccessDifficultyLabels = {
  en: {
    [AccessDifficulty.EASY]: 'Easy access',
    [AccessDifficulty.MODERATE]: 'Moderate access',
    [AccessDifficulty.HARD]: 'Hard access'    
  },
  es: {
    [AccessDifficulty.EASY]: 'Fácil acceso',
    [AccessDifficulty.MODERATE]: 'Acceso moderado',
    [AccessDifficulty.HARD]: 'Acceso difícil'   
  },
};
