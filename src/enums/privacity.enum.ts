export enum Privacity {
  URBAN_NEAR = 'URBAN_NEAR',       // Cerca de zonas urbanas o carreteras
  SEMI_REMOTE = 'SEMI_REMOTE',     // Moderadamente aislado, acceso intermedio
  REMOTE = 'REMOTE',               // Bastante alejado de zonas habitadas
  WILD = 'WILD',                   // Totalmente aislado, entorno salvaje
}

export const PrivacityLabels = {
  en: {
    [Privacity.URBAN_NEAR]: 'Close to urban areas or roads',
    [Privacity.SEMI_REMOTE]: 'Moderately remote, partially accessible',
    [Privacity.REMOTE]: 'Remote, far from civilization',
    [Privacity.WILD]: 'Wild, completely isolated area',
  },
  es: {
    [Privacity.URBAN_NEAR]: 'Cerca de zonas urbanas o carreteras',
    [Privacity.SEMI_REMOTE]: 'Moderadamente alejado, con acceso parcial',
    [Privacity.REMOTE]: 'Remoto, lejos de la civilización',
    [Privacity.WILD]: 'Salvaje, totalmente aislado',
  },
};
