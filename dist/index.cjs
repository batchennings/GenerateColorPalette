"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var generate_color_palette_exports = {};
__export(generate_color_palette_exports, {
  checkContrast: () => checkContrast,
  default: () => generatePalette
});
module.exports = __toCommonJS(generate_color_palette_exports);

// src/utils/hex2rgb.ts
function hex2rgb(args) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(args.hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {
    r: 0,
    g: 0,
    b: 0
  };
}

// src/utils/hsl2hex.ts
function hsl2hex(args) {
  args.s /= 100;
  args.l /= 100;
  let c = (1 - Math.abs(2 * args.l - 1)) * args.s, x = c * (1 - Math.abs(args.h / 60 % 2 - 1)), m = args.l - c / 2, r = 0, g = 0, b = 0;
  if (0 <= args.h && args.h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= args.h && args.h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= args.h && args.h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= args.h && args.h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= args.h && args.h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= args.h && args.h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  let hexr = Math.round((r + m) * 255).toString(16);
  let hexg = Math.round((g + m) * 255).toString(16);
  let hexb = Math.round((b + m) * 255).toString(16);
  if (hexr.length == 1)
    hexr = "0" + hexr;
  if (hexg.length == 1)
    hexg = "0" + hexg;
  if (hexb.length == 1)
    hexb = "0" + hexb;
  return "#" + hexr + hexg + hexb;
}

// src/utils/rgb2hsl.ts
function rgb2hsl(args) {
  args.r /= 255;
  args.g /= 255;
  args.b /= 255;
  let cmin = Math.min(args.r, args.g, args.b), cmax = Math.max(args.r, args.g, args.b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta === 0)
    h = 0;
  else if (cmax === args.r)
    h = (args.g - args.b) / delta % 6;
  else if (cmax === args.g)
    h = (args.b - args.r) / delta + 2;
  else
    h = (args.r - args.g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0)
    h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return {
    h,
    s,
    l
  };
}

// src/generate.ts
var HUE_COEFF_TO_LIGHT = 0.5;
var HUE_COEFF_TO_DARK = 0.5;
var SATURATION_COEFF_TO_LIGHT = 0.5;
var SATURATION_COEFF_TO_DARK = -0.5;
var HUES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
var LUMINOSITY_RANGE = [96, 90, 82, 73, 55, 47, 39, 31, 23, 15, 10];
function generate(color) {
  const rgbValue = hex2rgb({ hex: color });
  const hslValue = rgb2hsl({ r: rgbValue.r, g: rgbValue.g, b: rgbValue.b });
  const colorsArray = Array(HUES.length);
  const swatchPosition = getSwatchPosition(hslValue.l);
  colorsArray[swatchPosition] = {
    hexa: color,
    rgb: {
      r: rgbValue.r,
      g: rgbValue.g,
      b: rgbValue.b
    },
    hsl: {
      h: hslValue.h,
      s: hslValue.s,
      l: hslValue.l
    },
    name: HUES[swatchPosition],
    isBase: true
  };
  for (let i = 0; i < colorsArray.length; i++) {
    if (colorsArray[i] == null) {
      const newTintHsl = {
        h: getHue({ baseValue: hslValue.h, currentPosition: i, basePosition: swatchPosition }),
        s: getSaturation({ baseValue: hslValue.s, currentPosition: i, basePosition: swatchPosition }),
        l: getLuminosity({ baseValue: hslValue.l, currentPosition: i, basePosition: swatchPosition })
      };
      const newTintHexa = hsl2hex({ h: newTintHsl.h, s: newTintHsl.s, l: newTintHsl.l });
      const newTintRgb = hex2rgb({ hex: newTintHexa });
      colorsArray[i] = {
        hexa: newTintHexa,
        rgb: newTintRgb,
        hsl: newTintHsl,
        name: HUES[i],
        isBase: false
      };
    }
  }
  return colorsArray;
}
function getSwatchPosition(luminosity) {
  let position;
  for (let i = 0; i < LUMINOSITY_RANGE.length; i++) {
    position = i;
    if (luminosity > LUMINOSITY_RANGE[i]) {
      return position;
    }
  }
  position = LUMINOSITY_RANGE.length;
  return position;
}
function getHue(args) {
  let newHue;
  if (args.currentPosition < args.basePosition) {
    newHue = args.baseValue - (args.basePosition - args.currentPosition) * HUE_COEFF_TO_LIGHT;
    newHue = checkHue(newHue);
  } else if (args.currentPosition > args.basePosition) {
    newHue = args.baseValue + (args.currentPosition - args.basePosition) * HUE_COEFF_TO_DARK;
    newHue = checkHue(newHue);
  } else {
    newHue = 0;
  }
  return newHue;
}
function getSaturation(args) {
  let newSaturation;
  if (args.currentPosition < args.basePosition) {
    newSaturation = args.baseValue - (args.basePosition - args.currentPosition) * SATURATION_COEFF_TO_LIGHT;
    newSaturation = checkTreshold({ value: newSaturation, threshold: 0, type: "LOW" });
  } else if (args.currentPosition > args.basePosition) {
    newSaturation = args.baseValue + (args.currentPosition - args.basePosition) * SATURATION_COEFF_TO_DARK;
    newSaturation = checkTreshold({ value: newSaturation, threshold: 100, type: "HIGH" });
  } else {
    newSaturation = 0;
  }
  return newSaturation;
}
function getLuminosity(args) {
  let newLuminosity;
  if (args.currentPosition == args.basePosition - 1) {
    newLuminosity = args.baseValue + (LUMINOSITY_RANGE[args.basePosition - 2] - args.baseValue) / 2;
  } else if (args.currentPosition == args.basePosition + 1) {
    newLuminosity = args.baseValue - (args.baseValue - LUMINOSITY_RANGE[args.basePosition + 2]) / 2;
  } else {
    newLuminosity = LUMINOSITY_RANGE[args.currentPosition];
  }
  return newLuminosity;
}
function checkTreshold(args) {
  let ridge;
  if (args.type == "HIGH") {
    args.value > args.threshold ? ridge = args.threshold : ridge = args.value;
  } else if (args.type == "LOW") {
    args.value < args.threshold ? ridge = args.threshold : ridge = args.value;
  } else {
    ridge = 0;
  }
  return ridge;
}
function checkHue(value) {
  let newHue;
  const hueLimit = 360;
  if (value > hueLimit) {
    newHue = value - hueLimit;
  } else if (value < 0) {
    newHue = hueLimit + value;
  } else {
    newHue = value;
  }
  return newHue;
}

// src/utils/contrast.ts
var RED = 0.2126;
var GREEN = 0.7152;
var BLUE = 0.0722;
var GAMMA = 2.4;
function luminance(channels) {
  let a = [];
  Object.entries(channels).forEach(([key, value], index) => {
    value /= 255;
    a[index] = value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, GAMMA);
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}
function contrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1);
  var lum2 = luminance(rgb2);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// src/utils/controlColorInput.ts
function controlColorInput(value) {
  return true;
}

// index.ts
function generatePalette(color) {
  const colorsPalette = generate(color);
  const inputIsValid = controlColorInput(color);
  switch (inputIsValid) {
    case true:
      return colorsPalette;
      break;
    default:
      return null;
      break;
  }
}
function checkContrast(color1, color2) {
  const colorsContrast = contrast(color1, color2);
  return colorsContrast;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkContrast
});
