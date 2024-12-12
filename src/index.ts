import generate from "./generate";

export default function generateColorPalette(color:string){
    const colorsPalette:object = generate(color);
    return colorsPalette;
}