import generate from "./src/generate";
import contrast from "./src/utils/contrast";
import { rgbChannels } from "./src/interfaces/rgbChannels";

export default function generatePalette(color:string){
    const colorsPalette:Array<Object> = generate(color);
    return colorsPalette;
}

export function checkContrast(color1:rgbChannels, color2:rgbChannels){
    const colorsContrast:number = contrast(color1, color2);
    return colorsContrast;
}