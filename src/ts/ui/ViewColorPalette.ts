import contrastCheck from "../generate-color-palette/utils/contrastCheck";

// Afficher le nuancier
export default function ViewColorPalette(container, colorsPalette) {
    container.innerHTML = ""
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
        container.appendChild(colorNode)
    });
}