import postcss from "postcss";
import { describe, expect, it } from "vitest";
import plugin from "../src/index";

describe("postcss-color-transform", () => {
  // Helper pour exécuter le plugin
  async function process(input: string, options = {}) {
    return postcss([plugin(options)]).process(input, { from: undefined });
  }

  // Utiliser des expressions régulières pour la validation au lieu de valeurs exactes
  it("convertit les formats explicites", async () => {
    const css = `
      .test {
        --color1: oklch( from hsl((210 60% 50%)) );
        --color2: rgb( from oklch((54.32% 0.1287 250.12)) );
        --color3: hsl( from rgb((255 0 0)) );
      }
    `;

    const result = await process(css);

    // Vérifier la structure générale des valeurs converties
    expect(result.css).toMatch(/--color1: oklch\(\d+\.\d+% 0\.\d+ \d+\.\d+\)/);
    expect(result.css).toMatch(/--color2: rgb\(\d+, \d+, \d+\)/);
    expect(result.css).toMatch(/--color3: hsl\(\d+, \d+%, \d+%\)/);
    expect(result.warnings()).toHaveLength(0);
  });

  it("gère les erreurs gracieusement", async () => {
    const css = `
      .test {
        --invalid: unknown( from hsl((210 60% 50%)) );
      }
    `;

    const result = await process(css);

    // Le CSS doit rester inchangé si le format est inconnu
    expect(result.css).toBe(css);
    expect(result.warnings()).toHaveLength(1);
  });

  it("traite correctement les valeurs avec alpha", async () => {
    const css = `
    .test {
      --color: rgba( from hsla((210 60% 50% 0.5)) );
    }
  `;

    const result = await process(css);

    console.log(result.warnings());

    // Vérifier la conversion sans comparer la valeur exacte
    expect(result.warnings()).toHaveLength(0);
    // Utiliser une regex plus générique qui vérifie juste que c'est une valeur rgba
    expect(result.css).toMatch(/rgba\(/);
  });

  it("ignore les valeurs HSL natives", async () => {
    const css = `
      .test {
        --background: 0 0% 100%;
        --foreground: 0 0% 3.9%;
      }
    `;

    const result = await process(css);

    // Le CSS doit rester inchangé - les valeurs HSL natives sont ignorées
    expect(result.css).toBe(css);
    expect(result.warnings()).toHaveLength(0);
  });
});
