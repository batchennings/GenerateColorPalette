import hex2rgb from "./utils/hex2rgb";
import hsl2hex from "./utils/hsl2hex";
import rgb2hsl from "./utils/rgb2hsl";
import contrastCheck from "./utils/contrastCheck";

const HUE_COEFF_TO_LIGHT = 0.5;
const HUE_COEFF_TO_DARK = 0.5;
const SATURATION_COEFF_TO_LIGHT = 0.5;
const SATURATION_COEFF_TO_DARK = -0.5;

const HUES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
let LUMINOSITY_RANGE = [96, 90, 82, 73, 55, 47, 39, 31, 23, 15, 10];

function getSwatchPosition(luminosity: number) {
    let position: number;

    for (let i = 0; i < LUMINOSITY_RANGE.length; i++) {
        position = i;
        if (luminosity > LUMINOSITY_RANGE[i]) {
            return position;
        }
    }
    position = LUMINOSITY_RANGE.length;
    return position;
}

// Le coeur de l'app : permet d'obtenir une palette de couleur depuis une couleur de base
export default function generate(color: string) {
    const rgbValue = hex2rgb({ hex: color });
    const hslValue = rgb2hsl({ r: rgbValue.r, g: rgbValue.g, b: rgbValue.b });

    const colorsArray = Array(HUES.length);

    // determiner la position de la couleur dans le nuancier
    //// prendre la valeur de luminosité, (100 - Math.round(value/10))
    const swatchPosition = getSwatchPosition(hslValue.l);

    colorsArray[swatchPosition] = {
        hexa: color,
        rgb: {
            r: rgbValue.r,
            g: rgbValue.g,
            b: rgbValue.b,
        },
        hsl: {
            h: hslValue.h,
            s: hslValue.s,
            l: hslValue.l,
        },
        name: HUES[swatchPosition],
        isBase: true,
    };

    for (let i = 0; i < colorsArray.length; i++) {
        if (colorsArray[i] == null) {
            //on donne la teinte, saturation, luminosité
            const newTintHsl = {
                h: getHue({ baseValue: hslValue.h, currentPosition: i, basePosition: swatchPosition }),
                s: getSaturation({ baseValue: hslValue.s, currentPosition: i, basePosition: swatchPosition }),
                l: getLuminosity({ baseValue: hslValue.l, currentPosition: i, basePosition: swatchPosition }),
            };

            const newTintHexa = hsl2hex({ h: newTintHsl.h, s: newTintHsl.s, l: newTintHsl.l });
            const newTintRgb = hex2rgb({ hex: newTintHexa });
            colorsArray[i] = {
                hexa: newTintHexa,
                rgb: newTintRgb,
                hsl: newTintHsl,
                name: HUES[i],
                isBase: false,
            };
        }
    }
    return colorsArray;
}
interface hslArgs {
    baseValue: number;
    currentPosition: number;
    basePosition: number;
}
function getHue(args: hslArgs) {
    let newHue: number;
    if (args.currentPosition < args.basePosition) {
        newHue = args.baseValue - (args.basePosition - args.currentPosition) * HUE_COEFF_TO_LIGHT;
        newHue = checkHue(newHue);
    } else if (args.currentPosition > args.basePosition) {
        // si la teinte est plus sombre
        newHue = args.baseValue + (args.currentPosition - args.basePosition) * HUE_COEFF_TO_DARK;
        newHue = checkHue(newHue);
    } else {
        newHue = 0;
    }
    return newHue;
}

function getSaturation(args: hslArgs) {
    let newSaturation: number;
    if (args.currentPosition < args.basePosition) {
        // si la teinte est plus claire
        newSaturation = args.baseValue - (args.basePosition - args.currentPosition) * SATURATION_COEFF_TO_LIGHT;
        newSaturation = checkTreshold({ value: newSaturation, threshold: 0, type: "LOW" });
    } else if (args.currentPosition > args.basePosition) {
        // si la teinte est plus sombre
        newSaturation = args.baseValue + (args.currentPosition - args.basePosition) * SATURATION_COEFF_TO_DARK;
        newSaturation = checkTreshold({ value: newSaturation, threshold: 100, type: "HIGH" });
    } else {
        newSaturation = 0;
    }
    return newSaturation;
}

function getLuminosity(args: hslArgs) {
    let newLuminosity: number;
    if (args.currentPosition == args.basePosition - 1) {
        newLuminosity = args.baseValue + (LUMINOSITY_RANGE[args.basePosition - 2] - args.baseValue) / 2;
    } else if (args.currentPosition == args.basePosition + 1) {
        newLuminosity = args.baseValue - (args.baseValue - LUMINOSITY_RANGE[args.basePosition + 2]) / 2;
    } else {
        newLuminosity = LUMINOSITY_RANGE[args.currentPosition];
    }
    return newLuminosity;
}

// fonction qui permet de savoir si une valeur ne dépasse pas les seuils haut ou bas
interface thresholdArgs {
    value: number;
    threshold: number;
    type: string;
}
function checkTreshold(args: thresholdArgs) {
    let ridge: number;
    if (args.type == "HIGH") {
        // si le seuil est la valeur max
        args.value > args.threshold ? (ridge = args.threshold) : (ridge = args.value);
    } else if (args.type == "LOW") {
        // si le seuil est la valeur min
        args.value < args.threshold ? (ridge = args.threshold) : (ridge = args.value);
    } else {
        ridge = 0;
    }
    return ridge;
}
function checkHue(value: number) {
    let newHue: number;
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
