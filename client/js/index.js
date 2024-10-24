//const dataSrc = '../assets/data/data.json'; // la source de données
const submit = document.getElementById("submit");
const colorSwatches = document.getElementById("color-swatches");

const LUM_MAX = 95
const LUM_MIN = 15
const HUE_COEFF_TO_LIGHT = 0.03
const HUE_COEFF_TO_DARK = 0.03
const SATURATION_COEFF_TO_LIGHT = 0.05
const SATURATION_COEFF_TO_DARK = 0.05

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}

//const data = await getData(dataSrc);


///////////
/* Start */
///////////
(async function () {
    console.log('starter for js app with node+webpack/bootstrap');
    submit.addEventListener("click", validate);
})();



function validate(e) {
    e.preventDefault();
    const colorField = document.getElementById("color");
    const color = colorField.value;
    getColorPalette(color);
}
function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function getColorPalette(color) {
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
    const darkTint = { h: hslValue.h, s: hslValue.s, l: LUM_MIN-5 }

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
    console.log(colorsArray);

    // afficher le nuancier
    displayColorPalette(colorsArray)
}
function getHue(baseHue, currentPosition, basePosition) {
    let newHue;
    const coeffToLight = baseHue * HUE_COEFF_TO_LIGHT
    const coeffToDark = baseHue * HUE_COEFF_TO_DARK
    if (currentPosition < basePosition) {
        //newHue = baseHue - ((basePosition - currentPosition) * coeffToLight)
        //newHue > 0 ? newHue = newHue : newHue = 0
        newHue = baseHue
    }
    if (currentPosition > basePosition) { // si la teinte est plus sombre
        newHue = baseHue + ((currentPosition - basePosition) * coeffToDark)
        newHue < 360 ? newHue = newHue : newHue = 360
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
        newSaturation > 0 ? newSaturation = newSaturation : newSaturation = 0
    }
    if (currentPosition > basePosition) { // si la teinte est plus sombre
        // prendre l'écart avec cette teinte, appliquer un coeff de saturation
        // tant que la valeur est inférieure à 100, appliquer, sinon, 100
        newSaturation = baseSaturation + ((currentPosition - basePosition) * coeffToDark)
        newSaturation < 100 ? newSaturation = newSaturation : newSaturation = 100
    }
    return newSaturation
}

function displayColorPalette(colorsPalette) {
    colorSwatches.innerHTML = ""
    colorsPalette.forEach(color => {
        const colorNode = document.createElement('div');
        colorNode.setAttribute("class", "color-node")

        const colorHexa = document.createElement("span");
        colorHexa.innerHTML = color.hexa;
        const colorName = document.createElement("span");
        colorName.innerHTML = color.name;
        const HslName = document.createElement("span");
        HslName.innerHTML = "hsl(" + color.hsl.h + ", " + color.hsl.s + "%, " + color.hsl.l + "%)";

        colorNode.appendChild(colorName);
        colorNode.appendChild(HslName);
        colorNode.appendChild(colorHexa);

        if (color.isBase) {
            const colorStatus = document.createElement("span");
            colorStatus.setAttribute("class", "status")
            colorStatus.innerHTML = "Base"
            colorNode.appendChild(colorStatus);
        }


        //newNode.innerHTML = color.name
        colorNode.setAttribute("style", "background-color:" + color.hexa + ";")
        colorSwatches.appendChild(colorNode)
    });
}

function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function hsl2hex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}
function rgb2hsl(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta === 0)
        h = 0;
    // Red is max
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
        h: h,
        s: s,
        l: l
    }
}

export const name = 'index';