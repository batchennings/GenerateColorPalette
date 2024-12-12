import hex2rgb from "./utils/hex2rgb"
import hsl2hex from "./utils/hsl2hex"
import rgb2hsl from "./utils/rgb2hsl"
import scale from "./utils/scale"

const HUE_COEFF_TO_LIGHT = 0.5
const HUE_COEFF_TO_DARK = 0.5
const SATURATION_COEFF_TO_LIGHT = 0.5
const SATURATION_COEFF_TO_DARK = -0.5
//const PALETTE_LENGTH = 11

const HUES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]
let LUMINOSITY_RANGE = [96, 90, 82, 73, 55, 47, 39, 31, 23, 15, 10]

function getSwatchPosition(luminosity) {
    let position

    for (let i = 0; i < LUMINOSITY_RANGE.length; i++) {
        position = i
        if (luminosity > LUMINOSITY_RANGE[i]) {
            return position
        }
    }
    return position
}


// Le coeur de l'app : permet d'obtenir une palette de couleur depuis une couleur de base
export default function getColorsPalette(color) {
    const rgbValue = hex2rgb(color)
    const hslValue = rgb2hsl(rgbValue.r, rgbValue.g, rgbValue.b)

    const colorsArray = Array(HUES.length)

    // determiner la position de la couleur dans le nuancier
    //// prendre la valeur de luminosité, (100 - Math.round(value/10))
    const swatchPosition = getSwatchPosition(hslValue.l)

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
    }

    for (let i = 0; i < colorsArray.length; i++) {
        if (colorsArray[i] == null) {

            //on donne la teinte, saturation, luminosité
            const newTintHsl = {
                h: getHue(hslValue.h, i, swatchPosition),
                s: getSaturation(hslValue.s, i, swatchPosition),
                l: getLuminosity(hslValue.l, i, swatchPosition)
            }

            const newTintHexa = hsl2hex(newTintHsl.h, newTintHsl.s, newTintHsl.l)
            const newTintRgb = hex2rgb(newTintHexa)
            colorsArray[i] = {
                hexa: newTintHexa,
                rgb: newTintRgb,
                hsl: newTintHsl,
                name: HUES[i],
                isBase: false
            }
        }
    }
    return colorsArray
}
function getHue(baseHue, currentPosition, basePosition) {
    let newHue;
    if (currentPosition < basePosition) {
        newHue = baseHue - ((basePosition - currentPosition) * HUE_COEFF_TO_LIGHT)
        newHue = checkHue(newHue)
    }
    if (currentPosition > basePosition) { // si la teinte est plus sombre
        newHue = baseHue + ((currentPosition - basePosition) * HUE_COEFF_TO_DARK)
        newHue = checkHue(newHue)
    }
    return newHue
}
function getSaturation(baseSaturation, currentPosition, basePosition) {
    let newSaturation;
    if (currentPosition < basePosition) { // si la teinte est plus claire
        newSaturation = baseSaturation - ((basePosition - currentPosition) * SATURATION_COEFF_TO_LIGHT)
        newSaturation = checkTreshold(newSaturation, 0, "LOW")
    }
    if (currentPosition > basePosition) { // si la teinte est plus sombre
        newSaturation = baseSaturation + ((currentPosition - basePosition) * SATURATION_COEFF_TO_DARK)
        newSaturation = checkTreshold(newSaturation, 100, "HIGH")
    }
    return newSaturation
}
function getLuminosity(baseLuminosity, currentPosition, basePosition) {
    let newLuminosity;
    if (currentPosition == basePosition - 1) {
        newLuminosity = baseLuminosity + ((LUMINOSITY_RANGE[basePosition - 2] - baseLuminosity) / 2)
    } else if (currentPosition == basePosition + 1) {
        newLuminosity = baseLuminosity - ((baseLuminosity - LUMINOSITY_RANGE[basePosition + 2]) / 2)
    } else {
        newLuminosity = LUMINOSITY_RANGE[currentPosition];
    }
    return newLuminosity
}

// fonction qui permet de savoir si une valeur ne dépasse pas les seuils haut ou bas
function checkTreshold(value, threshold, type) {
    let ridge;
    if (type == "HIGH") { // si le seuil est la valeur max
        value > threshold ? ridge = threshold : ridge = value
    } else if (type == "LOW") { // si le seuil est la valeur min
        value < threshold ? ridge = threshold : ridge = value
    }
    return ridge
}
function checkHue(value) {
    let newHue;
    const hueLimit = 360
    if (value > hueLimit) {
        newHue = value - hueLimit
    } else if (value < 0) {
        newHue = hueLimit + value
    } else {
        newHue = value
    }
    return newHue
}