import getColorsPalette from "./getColorsPalette";

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

        //newNode.innerHTML = color.name
        colorNode.setAttribute("style", "background-color:" + color.hexa + ";")
        colorSwatches.appendChild(colorNode)
    });
}
