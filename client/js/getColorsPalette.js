import hex2rgb from "./utils/hex2rgb"
import hsl2hex from "./utils/hsl2hex"
import rgb2hsl from "./utils/rgb2hsl"
import scale from "./utils/scale"

const LUM_MAX = 95
const LUM_MIN = 10
const HUE_COEFF_TO_LIGHT = 0.5
const HUE_COEFF_TO_DARK = 0.5
const SATURATION_COEFF_TO_LIGHT = 0.5
const SATURATION_COEFF_TO_DARK = -0.5

// Le coeur de l'app : permet d'obtenir une palette de couleur depuis une couleur de base
export default function getColorsPalette(color) {
    const rgbValue = hex2rgb(color)
    const hslValue = rgb2hsl(rgbValue.r, rgbValue.g, rgbValue.b)

    const colorsArray = Array(10)

    // determiner la position de la couleur dans le nuancier
    //// prendre la valeur de luminosité, (100 - Math.round(value/10))

    const swatchBase = scale(Math.round(hslValue.l / 10), 0, 10, 1000, 0)
    const swatchPosition = scale(Math.round(hslValue.l / 10), 0, 10, 10, 0)

    colorsArray[swatchPosition] = {
        hexa: color,
        hsl: {
            h: hslValue.h,
            s: hslValue.s,
            l: hslValue.l
        },
        name: "color-" + swatchBase,
        isBase: true
    }

    for (let i = 0; i < colorsArray.length; i++) {
        if (colorsArray[i] == null) {
            //on donne la teinte, saturation, luminosité
            const newTint = {
                h: getHue(hslValue.h, i, swatchPosition),
                s: getSaturation(hslValue.s, i, swatchPosition),
                l: getLuminosity(hslValue.l, i, swatchPosition)
                //l: scale(i, 0, colorsArray.length, LUM_MAX, LUM_MIN)
            }
            colorsArray[i] = {
                hexa: hsl2hex(newTint.h, newTint.s, newTint.l),
                hsl: {
                    h: newTint.h,
                    s: newTint.s,
                    l: newTint.l
                },
                name: i == 0 ? "color-50" : "color-" + (i * 100),
                isBase: false
            }
        }
    }
    // ajouter le 950
    const darkTint = { 
        h: checkHue(colorsArray[colorsArray.length-1].hsl.h+3), 
        s: checkTreshold(colorsArray[colorsArray.length-1].hsl.s+3, 100, "HIGH"), 
        l: checkTreshold(colorsArray[colorsArray.length-1].hsl.l-5, 0, "LOW")
    }

    colorsArray.push({
        hexa: hsl2hex(darkTint.h, darkTint.s, darkTint.l),
        hsl: {
            h: darkTint.h,
            s: darkTint.s,
            l: darkTint.l
        },
        name: "color-950",
        isBase: false

    })
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
    newLuminosity = scale(currentPosition, 0, 10, LUM_MAX, LUM_MIN)
    // if (currentPosition < basePosition) { // si la teinte est plus claire
    //     newLuminosity = baseLuminosity - ((basePosition - currentPosition) * LUMINOSITY_COEFF_TO_LIGHT)
    //     newLuminosity = checkTreshold(newLuminosity, 0, "LOW")
    // }
    // if (currentPosition > basePosition) { // si la teinte est plus sombre
    //     newLuminosity = baseLuminosity + ((currentPosition - basePosition) * LUMINOSITY_COEFF_TO_DARK)
    //     newLuminosity = checkTreshold(newLuminosity, 100, "HIGH")
    // }
    return newLuminosity
}

// fonction qui permet de savoir si une valeur ne dépasse pas les seuils haut ou bas
function checkTreshold(value, threshold, type){
    let ridge;
    if(type == "HIGH") { // si le seuil est la valeur max
        value > threshold ? ridge = threshold : ridge = value
    } else if (type == "LOW")  { // si le seuil est la valeur min
        value < threshold ? ridge = threshold : ridge = value
    }
    return ridge
}
function checkHue(value){
    let newHue;
    const hueLimit = 360
    if(value > hueLimit) { 
        newHue = value - hueLimit
    } else if (value < 0)  { 
        newHue = hueLimit + value
    } else {
        newHue = value
    }
    return newHue
}
