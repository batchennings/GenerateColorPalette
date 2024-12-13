import generate from "./src/generate";

export default function generatePalette(color:string){
    const colorsPalette:object = generate(color);
    return colorsPalette;
}