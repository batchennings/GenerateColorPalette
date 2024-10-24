import hex2rgb from "./utils/hex2rgb"
import hsl2hex from "./utils/hsl2hex"
import rgb2hsl from "./utils/rgb2hsl"
import scale from "./utils/scale"

const LUM_MAX = 95
const LUM_MIN = 15
const HUE_COEFF_TO_LIGHT = 0.005
const HUE_COEFF_TO_DARK = 0.02
const SATURATION_COEFF_TO_LIGHT = 0.01
const SATURATION_COEFF_TO_DARK = -0.05

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
                l: scale(i, 0, colorsArray.length, LUM_MAX, LUM_MIN)
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
        h: checkTreshold(colorsArray[colorsArray.length-1].hsl.h+3, 360, "HIGH"), 
        s: checkTreshold(colorsArray[colorsArray.length-1].hsl.s+3, 100, "HIGH"), 
        l: checkTreshold(colorsArray[colorsArray.length-1].hsl.l-5, 0, "LOW")}

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
    const coeffToLight = baseHue * HUE_COEFF_TO_LIGHT
    const coeffToDark = baseHue * HUE_COEFF_TO_DARK
    if (currentPosition < basePosition) {
        newHue = baseHue - ((basePosition - currentPosition) * coeffToLight) 
        newHue = checkTreshold(newHue, 0, "LOW")
    }
    if (currentPosition > basePosition) { // si la teinte est plus sombre
        newHue = baseHue + ((currentPosition - basePosition) * coeffToDark)
        // newHue < 360 ? newHue = newHue : newHue = 360
        newHue = checkTreshold(newHue, 360, "HIGH")
    }
    return newHue
}
function getSaturation(baseSaturation, currentPosition, basePosition) {
    let newSaturation;
    const coeffToLight = baseSaturation * SATURATION_COEFF_TO_LIGHT
    const coeffToDark = baseSaturation * SATURATION_COEFF_TO_DARK
    if (currentPosition < basePosition) { // si la teinte est plus claire
        // prendre l'écart avec cette teinte, appliquer un coeff de désaturation
        // tant que la valeur est supérieure à 0, appliquer, sinon, 0
        newSaturation = baseSaturation - ((basePosition - currentPosition) * coeffToLight)
        //newSaturation > 0 ? newSaturation = newSaturation : newSaturation = 0
        newSaturation = checkTreshold(newSaturation, 0, "LOW")
    }
    if (currentPosition > basePosition) { // si la teinte est plus sombre
        // prendre l'écart avec cette teinte, appliquer un coeff de saturation
        // tant que la valeur est inférieure à 100, appliquer, sinon, 100
        newSaturation = baseSaturation + ((currentPosition - basePosition) * coeffToDark)
        //newSaturation < 100 ? newSaturation = newSaturation : newSaturation = 100
        newSaturation = checkTreshold(newSaturation, 100, "HIGH")
    }
    return newSaturation
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
