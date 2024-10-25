import getColorsPalette from "./getColorsPalette";
import contrastCheck from "./utils/contrastCheck"
import hex2rgb from "./utils/hex2rgb";

const submit = document.getElementById("submit");
const colorSwatches = document.getElementById("color-swatches");

(async function () {
    submit.addEventListener("click", validate);
})();

function validate(e) {
    e.preventDefault();
    const colorField = document.getElementById("color");
    const color = colorField.value;
    const colorsPalette = getColorsPalette(color);
    console.log(colorsPalette);
    
    displayColorPalette(colorsPalette)
}

// Afficher le nuancier
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
        HslName.innerHTML = "hsl(" + color.hsl.h + ", " + color.hsl.s.toFixed(2) + "%, " + color.hsl.l.toFixed(2) + "%)";

        colorNode.appendChild(colorName);
        colorNode.appendChild(HslName);
        colorNode.appendChild(colorHexa);

        if (color.isBase) {
            const colorStatus = document.createElement("span");
            colorStatus.setAttribute("class", "status")
            colorStatus.innerHTML = "Base"
            colorNode.appendChild(colorStatus);
        }
        const contrastWithBlack = contrastCheck([0, 0, 0], [color.rgb.r, color.rgb.g, color.rgb.b])

        colorNode.setAttribute("style", "background-color:" + color.hexa + ";")
        contrastWithBlack < 7 ? colorNode.classList.add("dark") : colorNode.classList.add("light")
        colorSwatches.appendChild(colorNode)
    });
    displayContrast(colorsPalette)
}
function displayContrast(colorsPalette) {
    const contrast50To500 = contrastCheck([
        colorsPalette[0].rgb.r,
        colorsPalette[0].rgb.g,
        colorsPalette[0].rgb.b
    ],
        [
            colorsPalette[5].rgb.r,
            colorsPalette[5].rgb.g,
            colorsPalette[5].rgb.b
        ])

    const contrast50To600 = contrastCheck([
        colorsPalette[0].rgb.r,
        colorsPalette[0].rgb.g,
        colorsPalette[0].rgb.b
    ],
        [
            colorsPalette[6].rgb.r,
            colorsPalette[6].rgb.g,
            colorsPalette[6].rgb.b
        ])
    const contrast500ToWhite = contrastCheck(
        [
            colorsPalette[5].rgb.r,
            colorsPalette[5].rgb.g,
            colorsPalette[5].rgb.b
        ], [255, 255, 255])

    const contrastNode1 = document.createElement('div');
    contrastNode1.setAttribute("class", "exemple")
    const Exemple1 = document.createElement('div')
    Exemple1.setAttribute("style", "background-color: " + colorsPalette[0].hexa + "; color: " + colorsPalette[5].hexa + ";")
    Exemple1.classList.add("class", "preview")
    Exemple1.innerHTML = "Exemple de texte"
    const Info1 = document.createElement('div')
    Info1.innerHTML = "color-500 sur color-50 / 1:" + contrast50To500.toFixed(2)
    contrastNode1.appendChild(Exemple1)
    contrastNode1.appendChild(Info1)

    const contrastNode2 = document.createElement('div');
    contrastNode2.setAttribute("class", "exemple")
    const Exemple2 = document.createElement('div')
    Exemple2.setAttribute("style", "background-color: " + colorsPalette[0].hexa + "; color: " + colorsPalette[6].hexa + ";")
    Exemple2.classList.add("class", "preview")
    Exemple2.innerHTML = "Exemple de texte"
    const Info2 = document.createElement('div')
    Info2.innerHTML = "color-600 sur color-50 / 1:" + contrast50To600.toFixed(2)
    contrastNode2.appendChild(Exemple2)
    contrastNode2.appendChild(Info2)

    const contrastNode3 = document.createElement('div');
    contrastNode3.setAttribute("class", "exemple")
    const Exemple3 = document.createElement('div')
    Exemple3.setAttribute("style", "background-color: " + colorsPalette[5].hexa + "; color: #FFFFFF;")
    Exemple3.classList.add("class", "preview")
    Exemple3.innerHTML = "Exemple de texte"
    const Info3 = document.createElement('div')
    Info3.innerHTML = "Blanc sur color-500 / 1:" + contrast500ToWhite.toFixed(2)
    contrastNode3.appendChild(Exemple3)
    contrastNode3.appendChild(Info3)

    colorSwatches.appendChild(contrastNode1)
    colorSwatches.appendChild(contrastNode2)
    colorSwatches.appendChild(contrastNode3)

}
