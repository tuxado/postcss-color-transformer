# PostCSS Color Converter

A PostCSS plugin for converting between different color formats.

## Features

- Explicit conversion between color formats with intuitive syntax
- Supports RGB, RGBA, HSL, HSLA, OKLCH, LAB, LCH, HWB, HSV, HSI
- Handles transparency (alpha) values
- Robust API with error handling
- Written in TypeScript for better reliability

## Installation

```bash
npm install postcss-color-transformer --save-dev
```

## Usage

```js
// postcss.config.js
module.exports = {
  plugins: [
    require("postcss-color-transformer")({
      // Options (toutes sont optionnelles)
      verbose: false, // Activer les logs détaillés
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
    }),
  ],
};
```

```css
.test {
  --color1: oklch(from hsl((210 60% 50%)));
  --color2: rgb(from oklch((54.32% 0.1287 250.12)));
  --color3: hsl(from rgb((255 0 0)));
}
```
