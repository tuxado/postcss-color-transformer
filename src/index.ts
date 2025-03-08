/**
 * postcss-color-transform
 * Plugin PostCSS pour convertir entre différents formats de couleurs
 * @author Votre Nom
 * @license MIT
 */
import { Declaration, PluginCreator, Result } from "postcss";
import { convertExplicitColor } from "./converter";

/**
 * Options du plugin
 */
export interface PluginOptions {
  /** Activer les logs détaillés */
  verbose?: boolean;
  /** Liste des formats de couleur à gérer dans les conversions explicites */
  supportedFormats?: string[];
}

/**
 * Plugin PostCSS pour convertir entre différents formats de couleurs
 * @param options Options de configuration du plugin
 * @returns Plugin PostCSS
 */
const colorConverter: PluginCreator<PluginOptions> = (options = {}) => {
  // Options par défaut
  const defaultOptions: Required<PluginOptions> = {
    verbose: false,
    supportedFormats: [
      "rgb",
      "rgba",
      "hsl",
      "hsla",
      "oklch",
      "lab",
      "lch",
      "hwb",
      "hsv",
      "hsi",
    ],
  };

  // Fusionner les options utilisateur avec les options par défaut
  const pluginOptions: Required<PluginOptions> = {
    ...defaultOptions,
    ...options,
  };

  // Gérer la journalisation en fonction de l'option verbose
  const log = (message: string): void => {
    if (pluginOptions.verbose) {
      console.log(`[postcss-color-transform] ${message}`);
    }
  };

  return {
    postcssPlugin: "postcss-color-transform",

    /**
     * Traitement de chaque déclaration CSS
     * @param decl Déclaration CSS
     * @param helpers Helpers PostCSS
     */
    Declaration(decl: Declaration, { result }: { result: Result }): void {
      // Obtenir la valeur de la déclaration
      const { value } = decl;

      // Ignorer les valeurs vides ou non-string
      if (!value || typeof value !== "string") {
        return;
      }

      // Format: toFormat( from fromFormat((values)));
      const conversionRegex = /(\w+)\(\s*from\s+(\w+)\(\(([^)]+)\)\)\s*\)/g;

      let newValue = value;
      let match: RegExpExecArray | null;
      let hasChanges = false;

      // Réinitialiser lastIndex pour éviter les problèmes
      conversionRegex.lastIndex = 0;

      try {
        // Parcourir toutes les conversions explicites
        while ((match = conversionRegex.exec(value)) !== null) {
          try {
            const [fullMatch, toFormat, fromFormat, colorValues] = match;

            log(
              `Détecté: conversion de ${fromFormat} vers ${toFormat} pour les valeurs: ${colorValues}`
            );

            // Vérifier si les formats sont supportés
            if (
              !pluginOptions.supportedFormats.includes(toFormat.toLowerCase())
            ) {
              result.warn(`Format de destination non supporté: ${toFormat}`, {
                node: decl,
              });
              continue;
            }

            if (
              !pluginOptions.supportedFormats.includes(fromFormat.toLowerCase())
            ) {
              result.warn(`Format source non supporté: ${fromFormat}`, {
                node: decl,
              });
              continue;
            }

            // Effectuer la conversion
            try {
              console.log(fromFormat, toFormat, colorValues);
              const converted = convertExplicitColor(
                fromFormat,
                toFormat,
                colorValues
              );

              // Remplacer dans la valeur
              newValue = newValue.replace(fullMatch, converted);
              hasChanges = true;

              log(`Conversion réussie: ${fullMatch} → ${converted}`);
            } catch (error) {
              const errorMsg = `Échec de conversion de ${fromFormat} vers ${toFormat}: ${
                (error as Error).message
              }`;
              result.warn(errorMsg, { node: decl });
              log(`Erreur: ${errorMsg}`);
            }
          } catch (error) {
            const errorMsg = `Erreur lors du traitement de la conversion "${
              match[0]
            }": ${(error as Error).message}`;
            result.warn(errorMsg, { node: decl });
            log(`Erreur: ${errorMsg}`);
          }
        }
      } catch (error) {
        const errorMsg = `Erreur générale dans le traitement des conversions explicites: ${
          (error as Error).message
        }`;
        result.warn(errorMsg, { node: decl });
        log(`Erreur: ${errorMsg}`);
      }

      // Mettre à jour la déclaration si des changements ont été effectués
      if (hasChanges) {
        decl.value = newValue;
      }
    },
  };
};

// Définir le nom du plugin PostCSS
colorConverter.postcss = true;

export default colorConverter;
export const postcssPlugin = "postcss-color-transform";
