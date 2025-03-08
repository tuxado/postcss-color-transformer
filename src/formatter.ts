/**
 * Module de formatage des couleurs
 */
import * as culori from "culori";

/**
 * Formate un objet couleur pour l'affichage CSS
 * @param color Objet couleur
 * @param format Format de sortie
 * @returns Chaîne CSS formatée
 */
export function formatColorOutput(color: culori.Color, format: string): string {
  // Vérifier la présence de l'objet couleur
  if (!color) {
    throw new Error("Objet couleur invalide ou undefined");
  }

  // Vérifier que le format est valide
  format = format.toLowerCase();

  // Vérifier si une valeur alpha est présente et différente de 1
  const hasAlpha =
    "alpha" in color && typeof color.alpha === "number" && color.alpha !== 1;
  const alpha = hasAlpha ? (color.alpha as number).toFixed(2) : undefined;

  switch (format) {
    case "rgb":
    case "rgba": {
      // S'assurer que c'est un objet RGB
      const rgbColor = color.mode === "rgb" ? color : culori.rgb(color);
      if (!rgbColor) throw new Error("Échec de conversion vers RGB");

      const r = Math.round((rgbColor.r as number) * 255);
      const g = Math.round((rgbColor.g as number) * 255);
      const b = Math.round((rgbColor.b as number) * 255);

      return hasAlpha
        ? `rgba(${r}, ${g}, ${b}, ${alpha})`
        : `rgb(${r}, ${g}, ${b})`;
    }

    case "hsl":
    case "hsla": {
      // S'assurer que c'est un objet HSL
      const hslColor = color.mode === "hsl" ? color : culori.hsl(color);
      if (!hslColor) throw new Error("Échec de conversion vers HSL");

      const h = Math.round(hslColor.h as number);
      const s = Math.round((hslColor.s as number) * 100);
      const l = Math.round((hslColor.l as number) * 100);

      return hasAlpha
        ? `hsla(${h}, ${s}%, ${l}%, ${alpha})`
        : `hsl(${h}, ${s}%, ${l}%)`;
    }

    case "oklch": {
      // S'assurer que c'est un objet OKLCH
      const oklchColor = color.mode === "oklch" ? color : culori.oklch(color);
      if (!oklchColor) throw new Error("Échec de conversion vers OKLCH");

      const l = ((oklchColor.l as number) * 100).toFixed(2);
      const c =
        (oklchColor.c as number) === 0
          ? "0"
          : (oklchColor.c as number).toFixed(4);
      const h = (oklchColor.h as number)
        ? (oklchColor.h as number).toFixed(2)
        : "0";

      return hasAlpha
        ? `oklch(${l}% ${c} ${h} / ${alpha})`
        : `oklch(${l}% ${c} ${h})`;
    }

    case "lab": {
      // S'assurer que c'est un objet LAB
      const labColor = color.mode === "lab" ? color : culori.lab(color);
      if (!labColor) throw new Error("Échec de conversion vers LAB");

      const l = ((labColor.l as number) * 100).toFixed(2);
      const a = (labColor.a as number).toFixed(2);
      const b = (labColor.b as number).toFixed(2);

      return hasAlpha
        ? `lab(${l}% ${a} ${b} / ${alpha})`
        : `lab(${l}% ${a} ${b})`;
    }

    case "lch": {
      // S'assurer que c'est un objet LCH
      const lchColor = color.mode === "lch" ? color : culori.lch(color);
      if (!lchColor) throw new Error("Échec de conversion vers LCH");

      const l = ((lchColor.l as number) * 100).toFixed(2);
      const c = (lchColor.c as number).toFixed(2);
      const h = (lchColor.h as number)
        ? (lchColor.h as number).toFixed(2)
        : "0";

      return hasAlpha
        ? `lch(${l}% ${c} ${h} / ${alpha})`
        : `lch(${l}% ${c} ${h})`;
    }

    case "hwb": {
      // S'assurer que c'est un objet HWB
      const hwbColor = color.mode === "hwb" ? color : culori.hwb(color);
      if (!hwbColor) throw new Error("Échec de conversion vers HWB");

      const h = Math.round(hwbColor.h as number);
      const w = Math.round((hwbColor.w as number) * 100);
      const b = Math.round((hwbColor.b as number) * 100);

      return hasAlpha
        ? `hwb(${h} ${w}% ${b}% / ${alpha})`
        : `hwb(${h} ${w}% ${b}%)`;
    }

    case "hsv": {
      // S'assurer que c'est un objet HSV
      const hsvColor = color.mode === "hsv" ? color : culori.hsv(color);
      if (!hsvColor) throw new Error("Échec de conversion vers HSV");

      const h = Math.round(hsvColor.h as number);
      const s = Math.round((hsvColor.s as number) * 100);
      const v = Math.round((hsvColor.v as number) * 100);

      return hasAlpha
        ? `hsv(${h}, ${s}%, ${v}%, ${alpha})`
        : `hsv(${h}, ${s}%, ${v}%)`;
    }

    case "hsi": {
      // S'assurer que c'est un objet HSI
      const hsiColor = color.mode === "hsi" ? color : culori.hsi(color);
      if (!hsiColor) throw new Error("Échec de conversion vers HSI");

      const h = Math.round(hsiColor.h as number);
      const s = Math.round((hsiColor.s as number) * 100);
      const i = Math.round((hsiColor.i as number) * 100);

      return hasAlpha
        ? `hsi(${h}, ${s}%, ${i}%, ${alpha})`
        : `hsi(${h}, ${s}%, ${i}%)`;
    }

    default:
      throw new Error(`Format de sortie non supporté: ${format}`);
  }
}
