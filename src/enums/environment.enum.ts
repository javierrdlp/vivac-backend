export enum Environment {
  PATH = 'PATH',             // Camino o sendero cercano
  BRIDGE = 'BRIDGE',         // Puente o pasarela
  WATER_SOURCE = 'WATER_SOURCE', // Fuente o arroyo
  CAVE = 'CAVE',             // Cueva o abrigo natural
  SHELTER = 'SHELTER',       // Refugio artificial o de montaña
  TREE_AREA = 'TREE_AREA',   // Zona arbolada
  ROCK_WALL = 'ROCK_WALL',   // Pared rocosa o acantilado
  VIEWPOINT = 'VIEWPOINT',   // Mirador o punto panorámico
  RUINS = 'RUINS',           // Ruinas o construcciones antiguas
}

export const EnvironmentLabels = {
  en: {
    [Environment.PATH]: 'Path or trail nearby',
    [Environment.BRIDGE]: 'Bridge or walkway',
    [Environment.WATER_SOURCE]: 'Water source (spring, stream)',
    [Environment.CAVE]: 'Cave or natural shelter',
    [Environment.SHELTER]: 'Mountain or artificial shelter',
    [Environment.TREE_AREA]: 'Tree area or forest patch',
    [Environment.ROCK_WALL]: 'Rock wall or cliff',
    [Environment.VIEWPOINT]: 'Viewpoint or scenic overlook',
    [Environment.RUINS]: 'Ruins or old structure',
  },
  es: {
    [Environment.PATH]: 'Camino o sendero',
    [Environment.BRIDGE]: 'Puente o pasarela',
    [Environment.WATER_SOURCE]: 'Fuente o arroyo',
    [Environment.CAVE]: 'Cueva o abrigo natural',
    [Environment.SHELTER]: 'Refugio o caseta',
    [Environment.TREE_AREA]: 'Zona arbolada',
    [Environment.ROCK_WALL]: 'Pared rocosa o acantilado',
    [Environment.VIEWPOINT]: 'Mirador o punto panorámico',
    [Environment.RUINS]: 'Ruinas o construcciones antiguas',
  },
};
