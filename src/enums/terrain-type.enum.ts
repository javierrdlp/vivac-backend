export enum TerrainType {
  GRASS = 'GRASS',       // Terreno con hierba o pradera
  ROCKY = 'ROCKY',       // Terreno pedregoso o rocoso
  SAND = 'SAND',         // Arena (playa, dunas, ribera)
  GRAVEL = 'GRAVEL',     // Grava o piedrecilla suelta
  DIRT = 'DIRT',         // Tierra compacta o suelo natural  
}

export const TerrainTypeLabels = {
  en: {
    [TerrainType.GRASS]: 'Grass',
    [TerrainType.ROCKY]: 'Rocky',
    [TerrainType.SAND]: 'Sand',
    [TerrainType.GRAVEL]: 'Gravel',
    [TerrainType.DIRT]: 'Dirt',    
  },
  es: {
    [TerrainType.GRASS]: 'Hierba',
    [TerrainType.ROCKY]: 'Rocoso',
    [TerrainType.SAND]: 'Arena',
    [TerrainType.GRAVEL]: 'Grava',
    [TerrainType.DIRT]: 'Tierra',
  },
};
