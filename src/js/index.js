import getColorsPalette from "./getColorsPalette";
import ViewColorPalette from "./ui/ViewColorPalette";
import ViewContrast from "./ui/ViewContrast";

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

    ViewColorPalette(colorSwatches, colorsPalette)
    ViewContrast(colorSwatches, colorsPalette)
}