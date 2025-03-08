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

CSS source :

```css
.test {
  --color1: oklch(from hsl(x x x));
  --color2: rgb(from oklch(x x x));
  --color3: hsl(from rgb(x x x));
}
```

Compiled to :

```css
.test {
  --color1: oklch(y y y);
  --color2: rgb(y y y);
  --color3: hsl(y y y);
}
```
