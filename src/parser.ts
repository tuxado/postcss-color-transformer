/**
 * Module de parsing des valeurs de couleur
 */

/**
 * Parse une chaîne de valeurs de couleur en objet de propriétés
 * @param format Format de couleur (rgb, hsl, oklch, etc.)
 * @param valuesStr Chaîne de valeurs à parser
 * @returns Objet avec les propriétés de couleur
 */
export function parseColorValues(
  format: string,
  valuesStr: string
): Record<string, number> {
  // Nettoyer et normaliser la chaîne d'entrée
  let cleanStr = valuesStr.trim();

  // Traiter la syntaxe avec slash pour alpha (format moderne)
  // Ex: "210 60% 50% / 0.5"
  let alphaFromSlash: number | undefined;
  if (cleanStr.includes("/")) {
    const [colorPart, alphaPart] = cleanStr.split("/").map((p) => p.trim());
    cleanStr = colorPart;
    alphaFromSlash = parseFloat(alphaPart);
  }

  // Normaliser les espaces et virgules en séparations uniformes
  cleanStr = cleanStr
    .replace(/\s+/g, " ") // Convertir plusieurs espaces en un seul
    .replace(/,\s*/g, " "); // Convertir virgules+espaces en espaces

  // Diviser la chaîne en parties
  const parts = cleanStr.split(" ").map((part) => part.trim());

  switch (format) {
    case "rgb":
    case "rgba": {
      // Format RGB: r g b [a]
      // Si nous avons 3 parties, c'est rgb sans alpha ou le 4ème paramètre est l'alpha
      const [r, g, b, a] = parts;
      const alpha =
        alphaFromSlash !== undefined ? alphaFromSlash : a ? parseFloat(a) : 1;

      return {
        r: parseFloat(r) / 255,
        g: parseFloat(g) / 255,
        b: parseFloat(b) / 255,
        alpha,
      };
    }

    case "hsl":
    case "hsla": {
      // Format HSL: h s l [a]
      const [h, s, l, a] = parts;

      const alpha =
        alphaFromSlash !== undefined ? alphaFromSlash : a ? parseFloat(a) : 1;

      // Supprimer les % des valeurs si présents
      const sValue = s.replace(/%$/, "");
      const lValue = l.replace(/%$/, "");

      return {
        h: parseFloat(h),
        s: parseFloat(sValue) / 100,
        l: parseFloat(lValue) / 100,
        alpha,
      };
    }

    case "oklch": {
      // Format OKLCH: l c h [a]
      const [l, c, h, a] = parts;
      const alpha =
        alphaFromSlash !== undefined ? alphaFromSlash : a ? parseFloat(a) : 1;

      // Supprimer le % de l si présent
      const lValue = l.replace(/%$/, "");

      return {
        l: parseFloat(lValue) / 100,
        c: parseFloat(c),
        h: parseFloat(h),
        alpha,
      };
    }

    case "lab": {
      // Format LAB: l a b [alpha]
      const [l, a, b, alphaStr] = parts;
      const alpha =
        alphaFromSlash !== undefined
          ? alphaFromSlash
          : alphaStr
          ? parseFloat(alphaStr)
          : 1;

      // Supprimer le % de l si présent
      const lValue = l.replace(/%$/, "");

      return {
        l: parseFloat(lValue) / 100,
        a: parseFloat(a),
        b: parseFloat(b),
        alpha,
      };
    }

    case "lch": {
      // Format LCH: l c h [alpha]
      const [l, c, h, a] = parts;
      const alpha =
        alphaFromSlash !== undefined ? alphaFromSlash : a ? parseFloat(a) : 1;

      // Supprimer le % de l si présent
      const lValue = l.replace(/%$/, "");

      return {
        l: parseFloat(lValue) / 100,
        c: parseFloat(c),
        h: parseFloat(h),
        alpha,
      };
    }

    case "hwb": {
      // Format HWB: h w b [alpha]
      const [h, w, b, a] = parts;
      const alpha =
        alphaFromSlash !== undefined ? alphaFromSlash : a ? parseFloat(a) : 1;

      // Supprimer les % de w et b si présents
      const wValue = w.replace(/%$/, "");
      const bValue = b.replace(/%$/, "");

      return {
        h: parseFloat(h),
        w: parseFloat(wValue) / 100,
        b: parseFloat(bValue) / 100,
        alpha,
      };
    }

    case "hsv": {
      // Format HSV: h s v [alpha]
      const [h, s, v, a] = parts;
      const alpha =
        alphaFromSlash !== undefined ? alphaFromSlash : a ? parseFloat(a) : 1;

      // Supprimer les % de s et v si présents
      const sValue = s.replace(/%$/, "");
      const vValue = v.replace(/%$/, "");

      return {
        h: parseFloat(h),
        s: parseFloat(sValue) / 100,
        v: parseFloat(vValue) / 100,
        alpha,
      };
    }

    case "hsi": {
      // Format HSI: h s i [alpha]
      const [h, s, i, a] = parts;
      const alpha =
        alphaFromSlash !== undefined ? alphaFromSlash : a ? parseFloat(a) : 1;

      // Supprimer les % de s et i si présents
      const sValue = s.replace(/%$/, "");
      const iValue = i.replace(/%$/, "");

      return {
        h: parseFloat(h),
        s: parseFloat(sValue) / 100,
        i: parseFloat(iValue) / 100,
        alpha,
      };
    }

    default:
      throw new Error(`Format de couleur non supporté: ${format}`);
  }
}
