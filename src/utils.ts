/**
 * Fonctions utilitaires pour le plugin
 */

/**
 * Vérifie si un format de couleur est supporté
 * @param format Format à vérifier
 * @param supportedFormats Liste des formats supportés
 * @returns true si le format est supporté
 */
export function isFormatSupported(
  format: string,
  supportedFormats: string[]
): boolean {
  return supportedFormats.includes(format.toLowerCase());
}

/**
 * Normalise une chaîne de valeurs pour traitement uniforme
 * @param value Valeur à normaliser
 * @returns Valeur normalisée
 */
export function normalizeValueString(value: string): string {
  return value.trim().replace(/\s+/g, " ").replace(/,\s*/g, " ");
}

/**
 * Extrait les valeurs numériques d'une chaîne
 * @param value Chaîne contenant des valeurs numériques
 * @returns Tableau de nombres
 */
export function extractNumbers(value: string): number[] {
  const matches = value.match(/-?\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
}
