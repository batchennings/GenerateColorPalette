import generate from "./src/generate";
import contrast from "./src/utils/contrast";
import { rgbChannels } from "./src/interfaces/rgbChannels";
import controlColorInput from "./src/utils/controlColorInput";

export default function generatePalette(color:string){
    const colorsPalette:any = generate(color);
    const inputIsValid:boolean = controlColorInput(color);

    const errorMessage:Object = {
        "message" : "Erreur de format. Le format entré n'est pas bon"
    }

    switch (inputIsValid) {
        case true:
            return colorsPalette;
            break;
    
        default:
            return errorMessage;
            break;
    }
}

export function checkContrast(color1:rgbChannels, color2:rgbChannels){
    const colorsContrast:number = contrast(color1, color2);
    return colorsContrast;
}