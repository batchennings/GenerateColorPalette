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
        const colorRgb = hex2rgb(color.hexa)
        const contrastWithBlack = contrastCheck([0,0,0], [colorRgb.r, colorRgb.g, colorRgb.b])
        
        //newNode.innerHTML = color.name
        colorNode.setAttribute("style", "background-color:" + color.hexa + ";")
        contrastWithBlack < 7 ? colorNode.classList.add("dark") : colorNode.classList.add("light")
        colorSwatches.appendChild(colorNode)
    });
    displayContrast(colorsPalette)
}
function displayContrast(colorsPalette){
    const contrastNode = document.createElement('div');
    console.log(colorsPalette);
    contrastNode.innerHTML = "Contraste ici"
}
