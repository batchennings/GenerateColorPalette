import generatePalette from "../dist/index.js"
import {checkContrast} from "../dist/index.js"


const color = "#FFCC00";
const palette = generatePalette(color);
console.log(palette);

const contrast = checkContrast(palette[0].rgb, palette[9].rgb);
console.log(contrast);