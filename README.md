# Generate Color Palette

```js
import generatePalette from "../dist/index.js"
const color = "#FFCC00";
const palette = generatePalette(color);
console.log(palette);
```
Generate a color palette based on the input color 
```js
  [
    {
      hexa: '#fffaeb',
      rgb: { r: 255, g: 250, b: 235 },
      hsl: { h: 45.5, s: 97.5, l: 96 },
      name: '50',
      isBase: false
    },
    {
      hexa: '#fef3cd',
      rgb: { r: 254, g: 243, b: 205 },
      hsl: { h: 46, s: 98, l: 90 },
      name: '100',
      isBase: false
    },
    {
      hexa: '#feeaa4',
      rgb: { r: 254, g: 234, b: 164 },
      hsl: { h: 46.5, s: 98.5, l: 82 },
      name: '200',
      isBase: false
    },
    {
      hexa: '#fee176',
      rgb: { r: 254, g: 225, b: 118 },
      hsl: { h: 47, s: 99, l: 73 },
      name: '300',
      isBase: false
    },
    {
      hexa: '#ffd63b',
      rgb: { r: 255, g: 214, b: 59 },
      hsl: { h: 47.5, s: 99.5, l: 61.5 },
      name: '400',
      isBase: false
    },
    {
      hexa: '#FFCC00',
      rgb: { r: 255, g: 204, b: 0 },
      hsl: { h: 48, s: 100, l: 50 },
      name: '500',
      isBase: true
    },
    {
      hexa: '#cea701',
      rgb: { r: 206, g: 167, b: 1 },
      hsl: { h: 48.5, s: 99.5, l: 40.5 },
      name: '600',
      isBase: false
    },
    {
      hexa: '#9d8101',
      rgb: { r: 157, g: 129, b: 1 },
      hsl: { h: 49, s: 99, l: 31 },
      name: '700',
      isBase: false
    },
    {
      hexa: '#746001',
      rgb: { r: 116, g: 96, b: 1 },
      hsl: { h: 49.5, s: 98.5, l: 23 },
      name: '800',
      isBase: false
    },
    {
      hexa: '#4c3f01',
      rgb: { r: 76, g: 63, b: 1 },
      hsl: { h: 50, s: 98, l: 15 },
      name: '900',
      isBase: false
    },
    {
      hexa: '#322a01',
      rgb: { r: 50, g: 42, b: 1 },
      hsl: { h: 50.5, s: 97.5, l: 10 },
      name: '950',
      isBase: false
    }
  ]
```