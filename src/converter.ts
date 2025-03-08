/**
 * Module de conversion entre formats de couleur
 */
import * as culori from "culori";
import { formatColorOutput } from "./formatter";
import { parseColorValues } from "./parser";

/**
 * Convertit une couleur explicite selon la syntaxe spécifiée
 * @param fromFormat Format source (rgb, hsl, oklch, etc.)
 * @param toFormat Format destination (rgb, hsl, oklch, etc.)
 * @param colorValuesStr Chaîne de valeurs de couleur
 * @returns Couleur convertie et formatée
 */
export function convertExplicitColor(
  fromFormat: string,
  toFormat: string,
  colorValuesStr: string
): string {
  // Normaliser les formats
  const fromFormatNormalized = fromFormat.toLowerCase();
  const toFormatNormalized = toFormat.toLowerCase();

  // Analyser les valeurs de couleur
  const colorObject = parseColorValues(fromFormatNormalized, colorValuesStr);

  // Convertir la couleur entre les formats
  const convertedColor = convertColor(
    colorObject,
    fromFormatNormalized,
    toFormatNormalized
  );

  // Formater le résultat
  return formatColorOutput(convertedColor, toFormatNormalized);
}

/**
 * Convertit une couleur d'un format à un autre en utilisant culori
 * @param colorObject Objet de couleur à convertir
 * @param fromFormat Format source
 * @param toFormat Format destination
 * @returns Objet couleur convertie
 */
export function convertColor(
  colorObject: Record<string, number>,
  fromFormat: string,
  toFormat: string
): culori.Color {
  // Ajouter le mode pour conformité avec l'API culori
  const colorWithMode = { ...colorObject, mode: fromFormat };

  try {
    // Convertir d'abord vers RGB (format intermédiaire fiable)
    let rgbColor: culori.Color;

    // Utiliser la fonction appropriée pour chaque format source
    switch (fromFormat) {
      case "rgb":
      case "rgba":
        rgbColor = culori.rgb(colorWithMode as culori.Rgb);
        break;
      case "hsl":
      case "hsla":
        rgbColor = culori.convertHslToRgb(colorWithMode as culori.Hsl);
        break;
      case "oklch":
        rgbColor = culori.rgb(colorWithMode as culori.Oklch);
        break;
      case "lab":
        rgbColor = culori.rgb(colorWithMode as culori.Lab);
        break;
      case "lch":
        rgbColor = culori.rgb(colorWithMode as culori.Lch);
        break;
      case "hwb":
        rgbColor = culori.rgb(colorWithMode as culori.Hwb);
        break;
      case "hsv":
        rgbColor = culori.rgb(colorWithMode as culori.Hsv);
        break;
      case "hsi":
        rgbColor = culori.rgb(colorWithMode as culori.Hsi);
        break;
      default:
        throw new Error(`Format source non supporté: ${fromFormat}`);
    }

    if (!rgbColor) {
      throw new Error(`Échec de conversion vers RGB depuis ${fromFormat}`);
    }

    // Convertir vers le format de destination
    let result: culori.Color;

    switch (toFormat) {
      case "rgb":
      case "rgba":
        result = rgbColor;
        break;
      case "hsl":
      case "hsla":
        result = culori.hsl(rgbColor);
        break;
      case "oklch":
        result = culori.oklch(rgbColor);
        break;
      case "lab":
        result = culori.lab(rgbColor);
        break;
      case "lch":
        result = culori.lch(rgbColor);
        break;
      case "hwb":
        result = culori.hwb(rgbColor);
        break;
      case "hsv":
        result = culori.hsv(rgbColor);
        break;
      case "hsi":
        result = culori.hsi(rgbColor);
        break;
      default:
        throw new Error(`Format destination non supporté: ${toFormat}`);
    }

    if (!result) {
      throw new Error(`Échec de conversion depuis RGB vers ${toFormat}`);
    }

    // Préserver la couche alpha
    if ("alpha" in colorObject && colorObject.alpha !== undefined) {
      (result as any).alpha = colorObject.alpha;
    }

    return result;
  } catch (error) {
    throw new Error(`Erreur de conversion: ${(error as Error).message}`);
  }
}
